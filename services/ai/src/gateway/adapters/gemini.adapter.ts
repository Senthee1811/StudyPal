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

export class GeminiLlmAdapter implements ILlmProvider {
  public readonly name = 'GEMINI';
  private readonly apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
  }

  async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  async chat(request: GatewayChatRequest): Promise<GatewayChatResponse> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const startTime = Date.now();
    const model = request.model || 'gemini-1.5-flash';

    // Format Gemini contents
    const contents = request.messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

    const response = await axios.post(
      url,
      {
        contents,
        generationConfig: {
          temperature: request.temperature ?? 0.7,
          maxOutputTokens: request.maxTokens ?? 1024,
        },
      },
      { timeout: 20000 },
    );

    const latencyMs = Date.now() - startTime;
    const candidate = response.data?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || '';
    const usageMetadata = response.data?.usageMetadata;

    const promptTokens = usageMetadata?.promptTokenCount || 0;
    const completionTokens = usageMetadata?.candidatesTokenCount || 0;

    return {
      content: text,
      provider: this.name,
      model,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
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
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const startTime = Date.now();
    const model = request.model || 'text-embedding-004';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:batchEmbedContents?key=${this.apiKey}`;

    const requests = request.texts.map((text) => ({
      model: `models/${model}`,
      content: { parts: [{ text }] },
    }));

    const response = await axios.post(url, { requests }, { timeout: 15000 });
    const latencyMs = Date.now() - startTime;

    const embeddings = response.data?.embeddings?.map((e: any) => e.values) || [];

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
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const startTime = Date.now();
    const model = request.model || 'gemini-1.5-flash';

    const promptWithFormat = `${request.systemPrompt || ''}\n\n${request.prompt}\n\nYou MUST return a valid JSON object only. No markdown formatting.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

    const response = await axios.post(
      url,
      {
        contents: [{ role: 'user', parts: [{ text: promptWithFormat }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      },
      { timeout: 25000 },
    );

    const latencyMs = Date.now() - startTime;
    const rawJson = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const parsed = JSON.parse(rawJson);
    const validated = request.schema.parse(parsed);

    return {
      data: validated,
      rawJson,
      provider: this.name,
      model,
      tokens: response.data?.usageMetadata?.totalTokenCount || 0,
      latencyMs,
    };
  }
}
