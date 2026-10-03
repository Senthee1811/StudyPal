export interface MasteryCalculationInput {
  evidenceCount: number;
  correctCount: number;
}

export interface MasteryCalculationOutput {
  evidenceCount: number;
  correctCount: number;
  masteryScore: number; // 0 - 100
  confidence: number;   // 0.0 - 1.0
  recommendation: {
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    reason: string;
    actionTitle: string;
  };
}

export class MasteryCalculator {
  /**
   * Calculates topic mastery using evidence count, Bayesian smoothing, and confidence estimation.
   * Deterministic and strictly rule-based (no ML).
   */
  static compute(input: MasteryCalculationInput): MasteryCalculationOutput {
    const { evidenceCount, correctCount } = input;

    if (evidenceCount <= 0) {
      return {
        evidenceCount: 0,
        correctCount: 0,
        masteryScore: 50.0,
        confidence: 0.0,
        recommendation: {
          priority: 'MEDIUM',
          reason: 'No questions attempted yet for this topic.',
          actionTitle: 'Take diagnostic practice quiz',
        },
      };
    }

    // Bayesian smoothed mastery calculation: prior 50% with weight 2
    const prior = 50.0;
    const priorWeight = 2.0;
    const rawAccuracy = (correctCount / evidenceCount) * 100;
    const masteryScore =
      (rawAccuracy * evidenceCount + prior * priorWeight) / (evidenceCount + priorWeight);

    // Confidence scales asymptotically with evidence count (10 questions = 1.0 confidence)
    const confidence = Math.min(1.0, evidenceCount / 10);

    // Rule-based recommendations
    let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
    let reason = '';
    let actionTitle = '';

    if (masteryScore < 50.0) {
      priority = 'HIGH';
      reason = `Mastery is below passing threshold (${Math.round(masteryScore)}%). High risk of syllabus deficit.`;
      actionTitle = 'Review textbook theory and foundational practice';
    } else if (masteryScore < 75.0) {
      priority = 'MEDIUM';
      reason = `Moderate mastery (${Math.round(masteryScore)}%). Reinforcement needed to secure A-grade standard.`;
      actionTitle = 'Practice timed model paper questions';
    } else {
      priority = 'LOW';
      reason = `Strong topic mastery (${Math.round(masteryScore)}%) with high confidence.`;
      actionTitle = 'Attempt challenging competitive exam questions';
    }

    return {
      evidenceCount,
      correctCount,
      masteryScore: Math.round(masteryScore * 10) / 10,
      confidence: Math.round(confidence * 100) / 100,
      recommendation: {
        priority,
        reason,
        actionTitle,
      },
    };
  }
}
