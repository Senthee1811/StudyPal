export class TextCleaner {
  /**
   * Sanitizes untrusted document text against prompt injection while preserving educational content
   */
  static sanitizeUntrustedText(text: string): string {
    if (!text) return '';

    let cleaned = text;

    // Neutralize common prompt injection patterns
    const injectionPatterns = [
      /ignore\s+(all\s+)?(previous|prior)\s+instructions/gi,
      /you\s+are\s+now\s+a/gi,
      /system\s*:\s*/gi,
      /\[\s*system\s*\]/gi,
      /<\s*system\s*>/gi,
      /assistant\s*:\s*/gi,
      /human\s*:\s*/gi,
      /bypass\s+(all\s+)?security/gi,
    ];

    for (const pattern of injectionPatterns) {
      cleaned = cleaned.replace(pattern, '[REDACTED_PROMPT_DIRECTIVE]');
    }

    // Strip common header/footer line patterns (e.g. "Page 12 of 150", "Ministry of Education")
    cleaned = cleaned.replace(/^\s*(page\s+\d+(\s+of\s+\d+)?|\d+)\s*$/gim, '');
    cleaned = cleaned.replace(/^\s*(ministry\s+of\s+education|department\s+of\s+examinations).*$/gim, '');

    // Normalize multiple whitespace and excessive newlines
    cleaned = cleaned.replace(/[ \t]+/g, ' ');
    cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n');

    return cleaned.trim();
  }
}
