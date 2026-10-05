import axios from 'axios';
import {
  ILlmProvider,
  GatewayChatRequest,
  GatewayChatResponse,
  GatewayStreamChunk,
  GatewayEmbedRequest,
  GatewayEmbedResponse,
  GatewayStructuredRequest,
  GatewayStructuredResponse,
} from '../llm-provider.interface.js';

export class OpenAiLlmAdapter implements ILlmProvider {
  public readonly name = 'OPENAI';
  private readonly apiKey: string | undefined;
  private readonly baseUrl: string;

  constructor(apiKey?: string, baseUrl = 'https://api.openai.com/v1') {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY;
    this.baseUrl = baseUrl;
  }

  async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  async chat(request: GatewayChatRequest): Promise<GatewayChatResponse> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const startTime = Date.now();
    const model = request.model || 'gpt-4o-mini';

    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      },
    );

    const latencyMs = Date.now() - startTime;
    const choice = response.data?.choices?.[0];
    const usage = response.data?.usage;

    return {
      content: choice?.message?.content || '',
      provider: this.name,
      model,
      promptTokens: usage?.prompt_tokens || 0,
      completionTokens: usage?.completion_tokens || 0,
      totalTokens: usage?.total_tokens || 0,
      latencyMs,
      traceId: request.traceId || `trace-${Date.now()}`,
    };
  }

  async *stream(request: GatewayChatRequest): AsyncIterable<GatewayStreamChunk> {
    const res = await this.chat(request);
    yield { content: res.content, done: true, provider: this.name };
  }

  async embed(request: GatewayEmbedRequest): Promise<GatewayEmbedResponse> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const startTime = Date.now();
    const model = request.model || 'text-embedding-3-small';

    const response = await axios.post(
      `${this.baseUrl}/embeddings`,
      {
        model,
        input: request.texts,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      },
    );

    const latencyMs = Date.now() - startTime;
    const embeddings = response.data?.data?.map((d: any) => d.embedding) || [];

    return {
      embeddings,
      dimensions: embeddings[0]?.length || 1536,
      provider: this.name,
      model,
      tokens: response.data?.usage?.total_tokens || 0,
      latencyMs,
    };
  }

  async structured<T>(request: GatewayStructuredRequest<T>): Promise<GatewayStructuredResponse<T>> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const startTime = Date.now();
    const model = request.model || 'gpt-4o-mini';

    const messages = [
      {
        role: 'system',
        content: `${request.systemPrompt || 'You are an educational assistant for Sri Lankan curriculum.'}\nOutput valid JSON only.`,
      },
      { role: 'user', content: request.prompt },
    ];

    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model,
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 25000,
      },
    );

    const latencyMs = Date.now() - startTime;
    const rawJson = response.data?.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(rawJson);
    const validated = request.schema.parse(parsed);

    return {
      data: validated,
      rawJson,
      provider: this.name,
      model,
      tokens: response.data?.usage?.total_tokens || 0,
      latencyMs,
    };
  }
}
