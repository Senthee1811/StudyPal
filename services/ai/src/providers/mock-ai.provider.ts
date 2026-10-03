import crypto from 'node:crypto';
import {
  IAiProvider,
  GenerateQuestionsOptions,
  GroundedQaOptions,
} from './ai-provider.interface.js';
import { QuestionContract, QuestionContractSchema } from '@studypal/contracts';

export class MockAiProvider implements IAiProvider {
  readonly name = 'mock-deterministic-provider';

  async generateQuestions(options: GenerateQuestionsOptions): Promise<QuestionContract[]> {
    const questions: QuestionContract[] = [];

    const sourcePages = options.contextTexts.map((c) => c.pageNumber).filter(Boolean);
    const pages = sourcePages.length > 0 ? sourcePages.slice(0, 3) : [1];

    for (let i = 0; i < options.numQuestions; i++) {
      const qIndex = i + 1;
      let prompt = `Practice question ${qIndex} regarding the studied curriculum material.`;
      let optA = 'Primary fundamental principle A';
      let optB = 'Derived corollary formulation B';
      let optC = 'Experimental empirical observation C';
      let optD = 'Alternative theoretical approach D';
      let explanation = `The correct answer is Option A based on page(s) ${pages.join(', ')}.`;

      if (options.language === 'si') {
        prompt = `අධ්‍යයනය කරන ලද විෂය කරුණු ඇසුරෙන් අංක ${qIndex} ප්‍රශ්නය:`;
        optA = 'මූලික විද්‍යාත්මක නියමය A';
        optB = 'ද්විතීයික ප්‍රමේයය B';
        optC = 'නිරීක්ෂණ දත්ත C';
        optD = 'විකල්ප විග්‍රහය D';
        explanation = `පෙළපොතේ ${pages.join(', ')} පිටු අනුව නිවැරදි පිළිතුර විකල්පය A වේ.`;
      } else if (options.language === 'ta') {
        prompt = `கற்ற பாடநெறி அடிப்படையிலான மாதிரி வினா ${qIndex}:`;
        optA = 'அடிப்படை விஞ்ஞான விதி A';
        optB = 'இரண்டாம் நிலைத் தேற்றம் B';
        optC = 'அவதானிப்புத் தரவு C';
        optD = 'மாற்று விளக்கம் D';
        explanation = `பாடநூலின் பக்கங்கள் ${pages.join(', ')} இன் படி சரியான விடை A ஆகும்.`;
      }

      const rawQuestion = {
        language: options.language,
        type: 'MCQ' as const,
        prompt: `${prompt} (${options.difficulty} Level)`,
        options: [optA, optB, optC, optD],
        correctAnswer: optA,
        explanation,
        difficulty: options.difficulty,
        topicId: options.topicId,
        sourcePages: pages,
        marks: options.difficulty === 'HARD' ? 3 : options.difficulty === 'MEDIUM' ? 2 : 1,
      };

      // Strict validation through QuestionContractSchema
      const validated = QuestionContractSchema.parse(rawQuestion);
      questions.push(validated);
    }

    return questions;
  }

  async generateSummary(
    text: string,
    language: 'si' | 'ta' | 'en',
    isDocumentLevel: boolean,
  ): Promise<string> {
    const scope = isDocumentLevel ? 'Complete Document' : 'Section';
    if (language === 'si') {
      return `[${scope} සාරාංශය]: මෙම අධ්‍යයන ද්‍රව්‍ය ශ්‍රී ලංකා විෂය නිර්දේශයේ මූලික සංකල්ප විස්තර කරයි. ප්‍රධාන කරුණු හා උදාහරණ පැහැදිලි කර ඇත.`;
    }
    if (language === 'ta') {
      return `[${scope} சுருக்கம்]: இந்த கற்றல் ஆவணம் இலங்கை தேசிய பாடத்திட்டத்தின் முக்கிய கருத்துக்களை விவரிக்கிறது.`;
    }
    return `[${scope} Summary]: This material covers core curriculum concepts according to the national syllabus, highlighting key definitions, formulas, and real-world Sri Lankan applications.`;
  }

  async generateGroundedAnswer(options: GroundedQaOptions): Promise<{
    answer: string;
    isUncertain: boolean;
    citations: { pageNumber: number; snippet: string }[];
  }> {
    // If no context or confidence is too low, return explicit uncertainty!
    if (!options.contextChunks || options.contextChunks.length === 0) {
      const uncertainMsg =
        options.language === 'si'
          ? 'සමාවන්න, සපයා ඇති අධ්‍යයන ද්‍රව්‍යවල මෙම ප්‍රශ්නයට නිශ්චිත පිළිතුරක් සඳහන් නොවේ.'
          : options.language === 'ta'
            ? 'மன்னிக்கவும், வழங்கப்பட்ட ஆவணத்தில் இந்த வினாவிற்கான போதுமான ஆதாரங்கள் இல்லை.'
            : 'I could not find sufficient verified evidence in the uploaded document to answer this question with certainty.';

      return {
        answer: uncertainMsg,
        isUncertain: true,
        citations: [],
      };
    }

    const topChunk = options.contextChunks[0]!;
    const citations = options.contextChunks.slice(0, 3).map((c) => ({
      pageNumber: c.pageNumber,
      snippet: c.text.substring(0, 150) + '...',
    }));

    const answer =
      options.language === 'si'
        ? `පිටු අංක ${citations.map((c) => c.pageNumber).join(', ')} අනුව: ${topChunk.text.substring(0, 180)}`
        : options.language === 'ta'
          ? `பக்கங்கள் ${citations.map((c) => c.pageNumber).join(', ')} இன் படி: ${topChunk.text.substring(0, 180)}`
          : `Based on page(s) ${citations.map((c) => c.pageNumber).join(', ')}: ${topChunk.text.substring(0, 180)}`;

    return {
      answer,
      isUncertain: false,
      citations,
    };
  }

  async createEmbeddings(texts: string[], dimensions = 1536): Promise<number[][]> {
    return texts.map((t) => {
      const vector: number[] = new Array(dimensions);
      const hash = crypto.createHash('sha256').update(t).digest();
      for (let i = 0; i < dimensions; i++) {
        // Deterministic pseudo-random float between -1 and 1
        const byte = hash[i % hash.length]!;
        vector[i] = (byte / 128.0) - 1.0;
      }
      // Normalize vector
      const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
      return vector.map((v) => (norm > 0 ? v / norm : 0));
    });
  }
}
