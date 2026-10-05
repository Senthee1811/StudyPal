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

export class MockLlmAdapter implements ILlmProvider {
  public readonly name = 'MOCK';

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async chat(request: GatewayChatRequest): Promise<GatewayChatResponse> {
    const startTime = Date.now();
    const lastMessage = request.messages[request.messages.length - 1]?.content || '';
    const lang = request.language;

    let content = '';
    if (lang === 'si') {
      content = `[Mock AI ගුරු සහකරු] ඔබගේ විමසීම: "${lastMessage}". මෙම සංකල්පය ශ්‍රී ලංකා ජාතික විෂය නිර්දේශයේ පැහැදිලි කර ඇත. පියවරෙන් පියවර අධ්‍යයනය කරමු.`;
    } else if (lang === 'ta') {
      content = `[Mock AI ஆசிரியர்] உங்கள் கேள்வி: "${lastMessage}". இது இலங்கை தேசிய பாடத்திட்டத்தில் விவரிக்கப்பட்டுள்ளது.`;
    } else {
      content = `[Mock AI StudyPal Tutor] In response to your question: "${lastMessage}". This concept is grounded in the Sri Lankan National Curriculum standards. Let's break it down step-by-step.`;
    }

    const latencyMs = Date.now() - startTime + 50;
    const promptTokens = Math.ceil(lastMessage.length / 4);
    const completionTokens = Math.ceil(content.length / 4);

    return {
      content,
      provider: this.name,
      model: request.model || 'mock-curriculum-v1',
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      latencyMs,
      traceId: request.traceId || `trace-${Date.now()}`,
    };
  }

  async *stream(request: GatewayChatRequest): AsyncIterable<GatewayStreamChunk> {
    const res = await this.chat(request);
    const words = res.content.split(' ');

    for (const word of words) {
      yield {
        content: word + ' ',
        done: false,
        provider: this.name,
      };
    }
    yield {
      content: '',
      done: true,
      provider: this.name,
    };
  }

  async embed(request: GatewayEmbedRequest): Promise<GatewayEmbedResponse> {
    const startTime = Date.now();
    const dims = request.dimensions || 1536;

    // Generate pseudo-deterministic vectors
    const embeddings = request.texts.map((text) => {
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i);
        hash |= 0;
      }
      return Array.from({ length: dims }, (_, i) => {
        const val = Math.sin(hash + i * 0.1);
        return parseFloat(val.toFixed(4));
      });
    });

    const latencyMs = Date.now() - startTime + 20;

    return {
      embeddings,
      dimensions: dims,
      provider: this.name,
      model: request.model || 'mock-embedding-v1',
      tokens: request.texts.reduce((acc, t) => acc + Math.ceil(t.length / 4), 0),
      latencyMs,
    };
  }

  async structured<T>(request: GatewayStructuredRequest<T>): Promise<GatewayStructuredResponse<T>> {
    const startTime = Date.now();

    // Default mock questions if requested
    let sampleData: any = {};
    if (request.task === 'question_gen') {
      sampleData = {
        questions: [
          {
            id: 'mock-q1',
            prompt:
              request.language === 'si'
                ? 'දර්ශක නීති අනුව 2^3 × 2^4 හි අගය කුමක්ද?'
                : request.language === 'ta'
                ? '2^3 × 2^4 இன் மதிப்பு என்ன?'
                : 'What is the value of 2^3 × 2^4 under index laws?',
            options: ['2^7', '2^12', '4^7', '4^12'],
            correctAnswer: '2^7',
            explanation: 'a^m × a^n = a^(m+n)',
            difficulty: 'MEDIUM',
            marks: 2,
          },
        ],
      };
    } else {
      sampleData = {
        title: 'Mock Structured Output',
        summary: 'Generated from mock adapter adhering to schema.',
        status: 'SUCCESS',
      };
    }

    // Validate through zod schema if possible or cast
    const parsed = request.schema.safeParse(sampleData);
    const finalData = parsed.success ? parsed.data : (sampleData as T);

    const latencyMs = Date.now() - startTime + 60;

    return {
      data: finalData,
      rawJson: JSON.stringify(finalData),
      provider: this.name,
      model: request.model || 'mock-structured-v1',
      tokens: 180,
      latencyMs,
    };
  }
}
