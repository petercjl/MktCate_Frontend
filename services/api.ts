import { AnalysisItem, AnalysisResult, TaskStatus } from '../types';
import { MOCK_HISTORY, MOCK_ANALYSIS_RESULT, getMockTaskStatus } from './mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    login: async (username: string, password: string): Promise<{ token: string }> => {
      await delay(800);
      if (username && password) {
        return { token: 'mock_jwt_token_123456' };
      }
      throw new Error('Invalid credentials');
    },
    register: async (username: string, password: string): Promise<void> => {
      await delay(800);
      console.log('Registered:', username);
    }
  },
  analysis: {
    list: async (): Promise<AnalysisItem[]> => {
      await delay(500);
      return [...MOCK_HISTORY];
    },
    upload: async (file: File, keyword: string, requirements?: string): Promise<{ task_id: string }> => {
      await delay(1000);
      return { task_id: `task_${Date.now()}` };
    },
    getStatus: async (id: string, mockStepCounter: number): Promise<TaskStatus> => {
      await delay(300); // Fast poll
      return getMockTaskStatus(mockStepCounter);
    },
    getResult: async (id: string): Promise<AnalysisResult> => {
      await delay(600);
      return { ...MOCK_ANALYSIS_RESULT, id, keyword: MOCK_HISTORY.find(h => h.id === id)?.keyword || '未知关键词' };
    },
    delete: async (id: string): Promise<void> => {
      await delay(400);
      console.log('Deleted analysis:', id);
    }
  }
};
