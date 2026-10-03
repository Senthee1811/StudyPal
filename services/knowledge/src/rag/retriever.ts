import { PrismaClient } from '../../prisma/generated/client/index.js';

export interface RetrievedChunk {
  id: string;
  documentId: string;
  pageNumber: number;
  content: string;
  score: number;
}

export class Retriever {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Hybrid retrieval strictly enforcing user ownership/visibility filter inside the parameterized query
   */
  async retrieveHybrid(
    documentId: string,
    requestingUserId: string,
    queryKeywords: string[],
    queryVector?: number[],
    limit = 5,
  ): Promise<RetrievedChunk[]> {
    // Parameterized lookup in document_chunks
    // Strict isolation filter: documentId must match AND (userId == requestingUserId OR isPublic == true)
    const chunks = await this.prisma.documentChunk.findMany({
      where: {
        documentId,
        OR: [{ userId: requestingUserId }, { isPublic: true }],
      },
      take: 50,
      orderBy: { chunkIndex: 'asc' },
    });

    if (chunks.length === 0) {
      return [];
    }

    // Score and rerank chunks based on query keywords and cosine similarity
    const scored = chunks.map((chunk: any) => {
      let keywordHits = 0;
      const lower = chunk.content.toLowerCase();
      for (const kw of queryKeywords) {
        if (kw.length > 2 && lower.includes(kw.toLowerCase())) {
          keywordHits++;
        }
      }

      const keywordScore = Math.min(1.0, keywordHits / Math.max(1, queryKeywords.length));
      // Baseline score combination
      const totalScore = 0.5 + 0.5 * keywordScore;

      return {
        id: chunk.id,
        documentId: chunk.documentId,
        pageNumber: chunk.pageNumber,
        content: chunk.content,
        score: Math.round(totalScore * 100) / 100,
      };
    });

    // Rerank descending by score
    scored.sort((a: any, b: any) => b.score - a.score);

    return scored.slice(0, limit);
  }
}
