import { z } from 'zod';

export type AiTaskType =
  | 'chat'
  | 'socratic_tutor'
  | 'grounded_qa'
  | 'question_gen'
  | 'summarize'
  | 'embed'
  | 'structured';

export type SupportedLanguage = 'si' | 'ta' | 'en';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GatewayChatRequest {
  traceId?: string;
  userId?: string;
  task: AiTaskType;
  language: SupportedLanguage;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface GatewayChatResponse {
  content: string;
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  traceId: string;
}

export interface GatewayStreamChunk {
  content: string;
  done: boolean;
  provider?: string;
}

export interface GatewayEmbedRequest {
  texts: string[];
  dimensions?: number;
  model?: string;
  traceId?: string;
}

export interface GatewayEmbedResponse {
  embeddings: number[][];
  dimensions: number;
  provider: string;
  model: string;
  tokens: number;
  latencyMs: number;
}

export interface GatewayStructuredRequest<T = any> {
  traceId?: string;
  userId?: string;
  task: AiTaskType;
  language: SupportedLanguage;
  prompt: string;
  systemPrompt?: string;
  schema: z.ZodType<T>;
  schemaName: string;
  model?: string;
}

export interface GatewayStructuredResponse<T = any> {
  data: T;
  rawJson: string;
  provider: string;
  model: string;
  tokens: number;
  latencyMs: number;
}

export interface ILlmProvider {
  readonly name: string;
  isAvailable(): Promise<boolean>;
  chat(request: GatewayChatRequest): Promise<GatewayChatResponse>;
  stream(request: GatewayChatRequest): AsyncIterable<GatewayStreamChunk>;
  embed(request: GatewayEmbedRequest): Promise<GatewayEmbedResponse>;
  structured<T>(request: GatewayStructuredRequest<T>): Promise<GatewayStructuredResponse<T>>;
}
