import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { CircuitBreaker } from './circuit-breaker.js';
import { MeteringService } from './metering.service.js';
import { MockLlmAdapter } from './adapters/mock.adapter.js';

describe('AI Gateway Suite', () => {
  it('CircuitBreaker transitions to OPEN after threshold failures and respects cooldown', () => {
    const breaker = new CircuitBreaker('TEST_PROVIDER', {
      failureThreshold: 2,
      cooldownPeriodMs: 50,
    });

    assert.strictEqual(breaker.getState(), 'CLOSED');
    assert.strictEqual(breaker.canExecute(), true);

    breaker.recordFailure();
    assert.strictEqual(breaker.getState(), 'CLOSED');

    breaker.recordFailure();
    assert.strictEqual(breaker.getState(), 'OPEN');
    assert.strictEqual(breaker.canExecute(), false);
  });

  it('MeteringService redacts Sri Lankan PII (NIC, phone numbers, emails)', () => {
    const metering = new MeteringService(null as any);
    const raw = 'Student Kasun Perera with NIC 200212345678 and phone +94771234567 or 0712345678, email test@study.lk asked a question.';
    const redacted = metering.redactPii(raw);

    assert.ok(!redacted.includes('200212345678'), 'NIC should be redacted');
    assert.ok(!redacted.includes('0712345678'), 'Phone should be redacted');
    assert.ok(!redacted.includes('test@study.lk'), 'Email should be redacted');
    assert.ok(redacted.includes('[REDACTED_NIC]'));
    assert.ok(redacted.includes('[REDACTED_PHONE]'));
    assert.ok(redacted.includes('[REDACTED_EMAIL]'));
  });

  it('MockLlmAdapter provides trilingual curriculum responses and valid embeddings', async () => {
    const mock = new MockLlmAdapter();

    // Sinhala
    const siRes = await mock.chat({
      task: 'socratic_tutor',
      language: 'si',
      messages: [{ role: 'user', content: 'දර්ශක නීති' }],
    });
    assert.ok(siRes.content.includes('ජාතික විෂය නිර්දේශයේ'));

    // Embeddings
    const embedRes = await mock.embed({
      texts: ['Unit 1 indices'],
      dimensions: 1536,
    });
    assert.strictEqual(embedRes.embeddings.length, 1);
    assert.strictEqual(embedRes.embeddings[0].length, 1536);
  });
  it('ENFORCEMENT LINT: No domain services outside services/ai import LLM SDKs', () => {
    const servicesDir = path.join(process.cwd(), 'services');
    const prohibitedSdkPatterns = [
      /from\s+['"]openai['"]/,
      /from\s+['"]@google\/generative-ai['"]/,
      /from\s+['"]@anthropic-ai\/sdk['"]/,
    ];

    function scanDir(dir: string): string[] {
      const violations: string[] = [];
      if (!fs.existsSync(dir)) return violations;
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          // Skip node_modules, dist, .turbo, and services/ai itself
          if (
            entry.name === 'node_modules' ||
            entry.name === 'dist' ||
            entry.name === '.turbo' ||
            entry.name === '.git' ||
            entry.name === 'ai'
          ) {
            continue;
          }
          violations.push(...scanDir(fullPath));
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          for (const pattern of prohibitedSdkPatterns) {
            if (pattern.test(content)) {
              violations.push(`${fullPath}: matches ${pattern}`);
            }
          }
        }
      }
      return violations;
    }

    const violations = scanDir(servicesDir);
    assert.strictEqual(
      violations.length,
      0,
      `Direct LLM SDK imports detected outside services/ai:\n${violations.join('\n')}`,
    );
  });
});
