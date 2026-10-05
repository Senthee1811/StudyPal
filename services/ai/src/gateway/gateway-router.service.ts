import { Injectable, Logger } from '@nestjs/common';
import {
  ILlmProvider,
  GatewayChatRequest,
  GatewayChatResponse,
  GatewayStreamChunk,
  GatewayEmbedRequest,
  GatewayEmbedResponse,
  GatewayStructuredRequest,
  GatewayStructuredResponse,
} from './llm-provider.interface.js';
import { MockLlmAdapter } from './adapters/mock.adapter.js';
import { OpenAiLlmAdapter } from './adapters/openai.adapter.js';
import { GeminiLlmAdapter } from './adapters/gemini.adapter.js';
import { OllamaLlmAdapter } from './adapters/ollama.adapter.js';
import { CircuitBreaker } from './circuit-breaker.js';
import { MeteringService } from './metering.service.js';
import { GatewayCacheService } from './cache.service.js';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class GatewayRouterService {
  private readonly logger = new Logger(GatewayRouterService.name);

  private readonly providers = new Map<string, ILlmProvider>();
  private readonly breakers = new Map<string, CircuitBreaker>();

  constructor(
    private readonly metering: MeteringService,
    private readonly cache: GatewayCacheService,
    private readonly prisma: PrismaService,
  ) {
    // Register all adapters
    this.registerProvider(new MockLlmAdapter());
    this.registerProvider(new OpenAiLlmAdapter());
    this.registerProvider(new GeminiLlmAdapter());
    this.registerProvider(new OllamaLlmAdapter());
  }

  private registerProvider(provider: ILlmProvider) {
    this.providers.set(provider.name, provider);
    this.breakers.set(provider.name, new CircuitBreaker(provider.name));
  }

  /**
   * Determine provider execution order: Primary -> Fallbacks
   */
  private async getProviderChain(task: string, language: string): Promise<ILlmProvider[]> {
    // 1. Check DB router config
    try {
      const config = await this.prisma.routerConfig.findFirst({
        where: {
          task: { in: [task, 'default'] },
          language: { in: [language, 'all'] },
          enabled: true,
        },
      });

      if (config) {
        const order = [config.primaryProvider, ...(config.fallbackProviders || [])];
        const chain: ILlmProvider[] = [];
        for (const pName of order) {
          const p = this.providers.get(pName.toUpperCase());
          if (p && !chain.includes(p)) chain.push(p);
        }
        if (!chain.some((p) => p.name === 'MOCK')) {
          chain.push(this.providers.get('MOCK')!);
        }
        return chain;
      }
    } catch (_) {}

    // 2. Default fallback chain based on available environment keys
    const chain: ILlmProvider[] = [];
    const gemini = this.providers.get('GEMINI')!;
    const openai = this.providers.get('OPENAI')!;
    const mock = this.providers.get('MOCK')!;

    if (await gemini.isAvailable()) chain.push(gemini);
    if (await openai.isAvailable()) chain.push(openai);
    chain.push(mock); // Guaranteed fallback

    return chain;
  }

  /**
   * Execute with circuit breaker & retry with jitter
   */
  private async executeWithFallback<T>(
    task: string,
    language: string,
    operationName: string,
    fn: (provider: ILlmProvider) => Promise<T>,
  ): Promise<{ result: T; provider: string; status: 'SUCCESS' | 'FALLBACK' }> {
    const chain = await this.getProviderChain(task, language);
    let lastError: Error | null = null;
    let isFallback = false;

    for (const provider of chain) {
      const breaker = this.breakers.get(provider.name);
      if (breaker && !breaker.canExecute()) {
        this.logger.warn(`Circuit open for provider ${provider.name}; skipping to fallback.`);
        isFallback = true;
        continue;
      }

      // Retry up to 2 times with jitter
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const result = await fn(provider);
          breaker?.recordSuccess();
          return {
            result,
            provider: provider.name,
            status: isFallback ? 'FALLBACK' : 'SUCCESS',
          };
        } catch (err: any) {
          lastError = err;
          this.logger.warn(
            `Attempt ${attempt + 1} failed for ${provider.name} on ${operationName}: ${err.message}`,
          );
          if (attempt === 0) {
            // Small jitter backoff
            await new Promise((resolve) => setTimeout(resolve, 150 + Math.random() * 200));
          }
        }
      }

      breaker?.recordFailure();
      isFallback = true;
    }

    throw lastError || new Error(`All providers in fallback chain failed for ${operationName}`);
  }

  // ---------------------------------------------------------------------------
  // PUBLIC GATEWAY OPERATIONS
  // ---------------------------------------------------------------------------

  async chat(request: GatewayChatRequest): Promise<GatewayChatResponse> {
    const startTime = Date.now();
    const traceId = request.traceId || `tr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const fullRequest = { ...request, traceId };

    try {
      const { result, provider, status } = await this.executeWithFallback(
        request.task,
        request.language,
        'chat',
        (p) => p.chat(fullRequest),
      );

      // Metering & audit log
      await this.metering.logUsage({
        traceId,
        userId: request.userId || 'anonymous',
        task: request.task,
        provider,
        model: result.model,
        promptTokens: result.promptTokens,
        completionTokens: result.completionTokens,
        latencyMs: Date.now() - startTime,
        status,
      });

      return result;
    } catch (err: any) {
      await this.metering.logUsage({
        traceId,
        userId: request.userId || 'anonymous',
        task: request.task,
        provider: 'NONE',
        model: 'unknown',
        promptTokens: 0,
        completionTokens: 0,
        latencyMs: Date.now() - startTime,
        status: 'ERROR',
        errorMessage: err.message,
      });
      throw err;
    }
  }

  async *stream(request: GatewayChatRequest): AsyncIterable<GatewayStreamChunk> {
    const chain = await this.getProviderChain(request.task, request.language);
    // Find first available provider
    let selectedProvider = chain[0] || this.providers.get('MOCK')!;
    yield* selectedProvider.stream(request);
  }

  async embed(request: GatewayEmbedRequest): Promise<GatewayEmbedResponse> {
    // Check cache first
    const cacheKey = this.cache.createCacheKey('embed', request.texts);
    const cached = this.cache.get<GatewayEmbedResponse>(cacheKey);
    if (cached) return cached;

    const { result } = await this.executeWithFallback('embed', 'en', 'embed', (p) =>
      p.embed(request),
    );

    // Cache embeddings for 1 hour
    this.cache.set(cacheKey, result, 3600);
    return result;
  }

  async structured<T>(request: GatewayStructuredRequest<T>): Promise<GatewayStructuredResponse<T>> {
    const { result, provider, status } = await this.executeWithFallback(
      request.task,
      request.language,
      'structured',
      (p) => p.structured<T>(request),
    );

    await this.metering.logUsage({
      traceId: request.traceId || `tr-${Date.now()}`,
      userId: request.userId || 'anonymous',
      task: request.task,
      provider,
      model: result.model,
      promptTokens: result.tokens,
      completionTokens: 0,
      latencyMs: result.latencyMs,
      status,
    });

    return result;
  }
}
