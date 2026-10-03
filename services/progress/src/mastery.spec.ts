import { describe, it } from 'node:test';
import assert from 'node:assert';
import { MasteryCalculator } from './mastery-calculator.js';

describe('ProgressService: Topic Mastery and Confidence Computation', () => {
  it('should return baseline 50% score and 0.0 confidence when no evidence exists', () => {
    const result = MasteryCalculator.compute({ evidenceCount: 0, correctCount: 0 });

    assert.strictEqual(result.evidenceCount, 0);
    assert.strictEqual(result.masteryScore, 50.0);
    assert.strictEqual(result.confidence, 0.0);
    assert.strictEqual(result.recommendation.priority, 'MEDIUM');
  });

  it('should trigger HIGH priority recommendation when mastery drops below 50%', () => {
    // 1 correct out of 5 questions
    const result = MasteryCalculator.compute({ evidenceCount: 5, correctCount: 1 });

    assert.strictEqual(result.evidenceCount, 5);
    assert.ok(result.masteryScore < 50.0, 'Mastery score should drop below 50%');
    assert.strictEqual(result.confidence, 0.5, '5 questions should yield 0.5 confidence');
    assert.strictEqual(result.recommendation.priority, 'HIGH');
    assert.ok(result.recommendation.reason.includes('below passing threshold'));
  });

  it('should apply Bayesian smoothing to prevent overconfidence on small samples', () => {
    // 2 correct out of 2 (100% raw accuracy)
    // Formula: (100 * 2 + 50 * 2) / (2 + 2) = 300 / 4 = 75%
    const result = MasteryCalculator.compute({ evidenceCount: 2, correctCount: 2 });

    assert.strictEqual(result.masteryScore, 75.0, '2/2 should be smoothed to 75% rather than raw 100%');
    assert.strictEqual(result.confidence, 0.2, 'Small sample must have low confidence (0.2)');
  });

  it('should achieve full confidence and LOW priority recommendation with sustained high mastery', () => {
    // 10 correct out of 10
    // Formula: (100 * 10 + 50 * 2) / (10 + 2) = 1100 / 12 = 91.7%
    const result = MasteryCalculator.compute({ evidenceCount: 10, correctCount: 10 });

    assert.ok(result.masteryScore > 85.0);
    assert.strictEqual(result.confidence, 1.0, '10 questions should yield max confidence (1.0)');
    assert.strictEqual(result.recommendation.priority, 'LOW');
  });
});
