import { ExtractedPage } from './pdf-extractor.js';

export interface TextChunk {
  pageNumber: number;
  chunkIndex: number;
  content: string;
  tokenCount: number;
}

export class DocumentChunker {
  /**
   * Chunks page text with sliding window and token budgeting
   */
  static chunkPages(pages: ExtractedPage[], maxWords = 150, overlapWords = 30): TextChunk[] {
    const chunks: TextChunk[] = [];
    let globalIndex = 0;

    for (const page of pages) {
      const words = page.text.split(/\s+/).filter(Boolean);
      if (words.length === 0) continue;

      let startIndex = 0;
      while (startIndex < words.length) {
        const endIndex = Math.min(words.length, startIndex + maxWords);
        const chunkWords = words.slice(startIndex, endIndex);
        const content = chunkWords.join(' ');

        chunks.push({
          pageNumber: page.pageNumber,
          chunkIndex: globalIndex++,
          content,
          tokenCount: Math.ceil(chunkWords.length * 1.3),
        });

        if (endIndex === words.length) break;
        startIndex += maxWords - overlapWords;
      }
    }

    return chunks;
  }
}
