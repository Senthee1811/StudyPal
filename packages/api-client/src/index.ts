import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  RegisterRequestDto,
  LoginRequestDto,
  AuthResponseDto,
  CreateUploadIntentDto,
  UploadIntentResponseDto,
  GroundedQaResponseDto,
  CreateQuizRequestDto,
  CreateExamRequestDto,
  SubmitAttemptDto,
  CreateTutorSessionDto,
} from '@studypal/contracts';
import { ApiStandardResponse } from '@studypal/types';

export interface ITokenStorage {
  getAccessToken(): Promise<string | null> | string | null;
  setAccessToken(token: string | null): Promise<void> | void;
  getRefreshToken(): Promise<string | null> | string | null;
  setRefreshToken(token: string | null): Promise<void> | void;
}

export class MemoryTokenStorage implements ITokenStorage {
  private access: string | null = null;
  private refresh: string | null = null;

  getAccessToken() {
    return this.access;
  }
  setAccessToken(token: string | null) {
    this.access = token;
  }
  getRefreshToken() {
    return this.refresh;
  }
  setRefreshToken(token: string | null) {
    this.refresh = token;
  }
}

export interface ApiClientOptions {
  baseURL?: string;
  tokenStorage?: ITokenStorage;
}

export class StudyPalApiClient {
  private client: AxiosInstance;
  public tokenStorage: ITokenStorage;

  constructor(options: ApiClientOptions = {}) {
    const baseURL = options.baseURL || process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000/api/v1';
    this.tokenStorage = options.tokenStorage || new MemoryTokenStorage();

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to attach bearer token
    this.client.interceptors.request.use(async (config) => {
      const token = await this.tokenStorage.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for automatic 401 token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes('/auth/')
        ) {
          originalRequest._retry = true;
          const refreshToken = await this.tokenStorage.getRefreshToken();
          if (refreshToken) {
            try {
              const refreshRes = await this.auth.refresh({ refreshToken });
              if (refreshRes.data?.accessToken) {
                await this.tokenStorage.setAccessToken(refreshRes.data.accessToken);
                if (refreshRes.data.refreshToken) {
                  await this.tokenStorage.setRefreshToken(refreshRes.data.refreshToken);
                }
                originalRequest.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;
                return this.client(originalRequest);
              }
            } catch (_) {
              await this.tokenStorage.setAccessToken(null);
              await this.tokenStorage.setRefreshToken(null);
            }
          }
        }
        return Promise.reject(error);
      },
    );
  }

  // ==========================================
  // AUTH
  // ==========================================
  public auth = {
    register: async (dto: RegisterRequestDto): Promise<ApiStandardResponse<AuthResponseDto>> => {
      const res = await this.client.post('/auth/register', dto);
      if (res.data?.data?.accessToken) {
        await this.tokenStorage.setAccessToken(res.data.data.accessToken);
        await this.tokenStorage.setRefreshToken(res.data.data.refreshToken);
      }
      return res.data;
    },
    login: async (dto: LoginRequestDto): Promise<ApiStandardResponse<AuthResponseDto>> => {
      const res = await this.client.post('/auth/login', dto);
      if (res.data?.data?.accessToken) {
        await this.tokenStorage.setAccessToken(res.data.data.accessToken);
        await this.tokenStorage.setRefreshToken(res.data.data.refreshToken);
      }
      return res.data;
    },
    refresh: async (dto: { refreshToken: string }): Promise<ApiStandardResponse<{ accessToken: string; refreshToken?: string }>> => {
      const res = await this.client.post('/auth/refresh', dto);
      return res.data;
    },
    logout: async (): Promise<ApiStandardResponse<void>> => {
      const refreshToken = await this.tokenStorage.getRefreshToken();
      const res = await this.client.post('/auth/logout', { refreshToken });
      await this.tokenStorage.setAccessToken(null);
      await this.tokenStorage.setRefreshToken(null);
      return res.data;
    },
    getMe: async (): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.get('/me');
      return res.data;
    },
  };

  // ==========================================
  // CURRICULUM
  // ==========================================
  public curriculum = {
    getCurriculum: async (): Promise<ApiStandardResponse<any[]>> => {
      const res = await this.client.get('/curriculum');
      return res.data;
    },
    getTopics: async (params?: { subjectId?: string; language?: string; grade?: number }): Promise<ApiStandardResponse<any[]>> => {
      const res = await this.client.get('/curriculum/topics', { params });
      return res.data;
    },
  };

  // ==========================================
  // DOCUMENTS
  // ==========================================
  public documents = {
    createUploadIntent: async (dto: CreateUploadIntentDto): Promise<ApiStandardResponse<UploadIntentResponseDto>> => {
      const res = await this.client.post('/documents/upload-intents', dto);
      return res.data;
    },
    completeUpload: async (documentId: string): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.post(`/documents/${documentId}/complete-upload`);
      return res.data;
    },
    list: async (): Promise<ApiStandardResponse<any[]>> => {
      const res = await this.client.get('/documents');
      return res.data;
    },
    get: async (documentId: string): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.get(`/documents/${documentId}`);
      return res.data;
    },
    delete: async (documentId: string): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.delete(`/documents/${documentId}`);
      return res.data;
    },
    getSummaries: async (documentId: string): Promise<ApiStandardResponse<any[]>> => {
      const res = await this.client.post(`/documents/${documentId}/summaries`);
      return res.data;
    },
    askQuestion: async (documentId: string, query: string, language = 'en'): Promise<ApiStandardResponse<GroundedQaResponseDto>> => {
      const res = await this.client.post(`/documents/${documentId}/qa`, { query, language });
      return res.data;
    },
    generateQuiz: async (documentId: string, dto?: Partial<CreateQuizRequestDto>): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.post(`/documents/${documentId}/quizzes`, dto || {});
      return res.data;
    },
  };

  // ==========================================
  // EXAMS & ASSESSMENTS
  // ==========================================
  public exams = {
    list: async (): Promise<ApiStandardResponse<any[]>> => {
      const res = await this.client.get('/exams');
      return res.data;
    },
    get: async (examId: string): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.get(`/exams/${examId}`);
      return res.data;
    },
    create: async (dto: CreateExamRequestDto): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.post('/exams', dto);
      return res.data;
    },
    startAttempt: async (examId: string): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.post(`/exams/${examId}/attempts`);
      return res.data;
    },
    saveAnswer: async (attemptId: string, questionId: string, studentAnswer: string): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.post(`/attempts/${attemptId}/answers`, { questionId, studentAnswer });
      return res.data;
    },
    submitAttempt: async (attemptId: string, dto: SubmitAttemptDto): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.post(`/attempts/${attemptId}/submit`, dto);
      return res.data;
    },
    getAttempt: async (attemptId: string): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.get(`/attempts/${attemptId}`);
      return res.data;
    },
    getQuiz: async (quizId: string): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.get(`/quizzes/${quizId}`);
      return res.data;
    },
  };

  // ==========================================
  // PROGRESS
  // ==========================================
  public progress = {
    getMyProgress: async (): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.get('/students/me/progress');
      return res.data;
    },
    getMyRecommendations: async (): Promise<ApiStandardResponse<any[]>> => {
      const res = await this.client.get('/students/me/recommendations');
      return res.data;
    },
  };

  // ==========================================
  // TUTOR & VOICE
  // ==========================================
  public tutor = {
    createSession: async (dto: CreateTutorSessionDto): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.post('/tutor/sessions', dto);
      return res.data;
    },
    listSessions: async (): Promise<ApiStandardResponse<any[]>> => {
      const res = await this.client.get('/tutor/sessions');
      return res.data;
    },
    getSession: async (sessionId: string): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.get(`/tutor/sessions/${sessionId}`);
      return res.data;
    },
    sendMessage: async (sessionId: string, content: string): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.post(`/tutor/sessions/${sessionId}/messages`, { content });
      return res.data;
    },
    createVoiceSession: async (dto?: { topicId?: string; language?: string }): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.post('/voice/sessions', dto || {});
      return res.data;
    },
  };

  // ==========================================
  // GEOGRAPHY
  // ==========================================
  public geography = {
    getFeatures: async (): Promise<ApiStandardResponse<any[]>> => {
      const res = await this.client.get('/geography/features');
      return res.data;
    },
    getQuestions: async (language = 'en'): Promise<ApiStandardResponse<any[]>> => {
      const res = await this.client.get('/geography/questions', { params: { language } });
      return res.data;
    },
    submitAttempt: async (body: { questionId: string; latitude: number; longitude: number }): Promise<ApiStandardResponse<any>> => {
      const res = await this.client.post('/geography/attempts', body);
      return res.data;
    },
  };
}
