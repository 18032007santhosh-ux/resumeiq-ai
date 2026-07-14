import api from './api';

export interface GitHubAnalysisPayload {
  resumeId: string;
  githubUrl: string;
}

export const analyzeGitHub = async (payload: GitHubAnalysisPayload) => {
  const response = await api.post('/github/analyze', payload);
  return response.data;
};

export const getGitHubHistory = async () => {
  const response = await api.get('/github/history');
  return response.data;
};

export const getGitHubAnalysis = async (id: string) => {
  const response = await api.get(`/github/${id}`);
  return response.data;
};

export const deleteGitHubAnalysis = async (id: string) => {
  const response = await api.delete(`/github/${id}`);
  return response.data;
};
