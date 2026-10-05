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

export class OllamaLlmAdapter implements ILlmProvider {
  public readonly name = 'OLLAMA';
  private readonly baseUrl: string;
  private readonly enabled: boolean;

  constructor(baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434') {
    this.baseUrl = baseUrl;
    this.enabled = process.env.ENABLE_OLLAMA === 'true';
  }

  async isAvailable(): Promise<boolean> {
    if (!this.enabled) return false;
    try {
      const res = await axios.get(`${this.baseUrl}/api/tags`, { timeout: 1500 });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  async chat(request: GatewayChatRequest): Promise<GatewayChatResponse> {
    if (!this.enabled) {
      throw new Error('Ollama provider is disabled via ENABLE_OLLAMA=false');
    }

    const startTime = Date.now();
    const model = request.model || 'llama3';

    const response = await axios.post(
      `${this.baseUrl}/api/chat`,
      {
        model,
        messages: request.messages,
        stream: false,
      },
      { timeout: 30000 },
    );

    const latencyMs = Date.now() - startTime;
    const content = response.data?.message?.content || '';

    return {
      content,
      provider: this.name,
      model,
      promptTokens: response.data?.prompt_eval_count || 0,
      completionTokens: response.data?.eval_count || 0,
      totalTokens: (response.data?.prompt_eval_count || 0) + (response.data?.eval_count || 0),
      latencyMs,
      traceId: request.traceId || `trace-${Date.now()}`,
    };
  }

  async *stream(request: GatewayChatRequest): AsyncIterable<GatewayStreamChunk> {
    const res = await this.chat(request);
    yield { content: res.content, done: true, provider: this.name };
  }

  async embed(request: GatewayEmbedRequest): Promise<GatewayEmbedResponse> {
    if (!this.enabled) {
      throw new Error('Ollama provider is disabled');
    }

    const startTime = Date.now();
    const model = request.model || 'nomic-embed-text';

    const embeddings: number[][] = [];
    for (const text of request.texts) {
      const res = await axios.post(
        `${this.baseUrl}/api/embeddings`,
        { model, prompt: text },
        { timeout: 15000 },
      );
      embeddings.push(res.data?.embedding || []);
    }

    const latencyMs = Date.now() - startTime;

    return {
      embeddings,
      dimensions: embeddings[0]?.length || 768,
      provider: this.name,
      model,
      tokens: request.texts.reduce((a, b) => a + Math.ceil(b.length / 4), 0),
      latencyMs,
    };
  }

  async structured<T>(request: GatewayStructuredRequest<T>): Promise<GatewayStructuredResponse<T>> {
    const chatRes = await this.chat({
      task: request.task,
      language: request.language,
      messages: [
        {
          role: 'system',
          content: `${request.systemPrompt || ''}\nReturn JSON strictly according to ${request.schemaName}.`,
        },
        { role: 'user', content: request.prompt },
      ],
      model: request.model,
    });

    const parsed = JSON.parse(chatRes.content);
    const validated = request.schema.parse(parsed);

    return {
      data: validated,
      rawJson: chatRes.content,
      provider: this.name,
      model: chatRes.model,
      tokens: chatRes.totalTokens,
      latencyMs: chatRes.latencyMs,
    };
  }
}
