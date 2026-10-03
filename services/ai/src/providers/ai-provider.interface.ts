import { QuestionContract } from '@studypal/contracts';

export interface GenerateQuestionsOptions {
  topicId: string;
  language: 'si' | 'ta' | 'en';
  numQuestions: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  contextTexts: { pageNumber: number; text: string }[];
}

export interface GroundedQaOptions {
  query: string;
  language: 'si' | 'ta' | 'en';
  contextChunks: { pageNumber: number; text: string; relevanceScore: number }[];
}

export interface IAiProvider {
  readonly name: string;
  generateQuestions(options: GenerateQuestionsOptions): Promise<QuestionContract[]>;
  generateSummary(text: string, language: 'si' | 'ta' | 'en', isDocumentLevel: boolean): Promise<string>;
  generateGroundedAnswer(options: GroundedQaOptions): Promise<{
    answer: string;
    isUncertain: boolean;
    citations: { pageNumber: number; snippet: string }[];
  }>;
  createEmbeddings(texts: string[], dimensions?: number): Promise<number[][]>;
}
