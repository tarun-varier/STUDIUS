import axios from 'axios';
import { QuestionBank, StudyMaterial, QueryResponse } from '@/types';

// Use environment variable or default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const resourcesApi = {
  // Question Banks
  getQuestionBanks: async (skip = 0, limit = 100) => {
    const response = await apiClient.get<QuestionBank[]>(`/resources/question-banks/?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  createQuestionBank: async (formData: FormData) => {
    const response = await apiClient.post<QuestionBank>('/resources/question-banks/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Study Materials
  getStudyMaterials: async (skip = 0, limit = 100) => {
    const response = await apiClient.get<StudyMaterial[]>(`/resources/study-materials/?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  createStudyMaterial: async (formData: FormData) => {
    const response = await apiClient.post<StudyMaterial>('/resources/study-materials/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const queryApi = {
  ask: async (query: string) => {
    const response = await apiClient.post<QueryResponse>('/query/', { query });
    return response.data;
  }
};
