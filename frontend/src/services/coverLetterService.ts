import api from './api';

export interface CoverLetterPayload {
  resumeId: string;
  company: string;
  position: string;
  hiringManager?: string;
  tone: 'Professional' | 'Formal' | 'Friendly' | 'Confident' | 'Enthusiastic';
  length: 'Short' | 'Medium' | 'Long';
  jobDescription?: string;
}

export const generateCoverLetter = async (payload: CoverLetterPayload) => {
  const response = await api.post('/cover-letter/generate', payload);
  return response.data;
};

export const getCoverLettersHistory = async () => {
  const response = await api.get('/cover-letter/history');
  return response.data;
};

export const getCoverLetter = async (id: string) => {
  const response = await api.get(`/cover-letter/${id}`);
  return response.data;
};

export const updateCoverLetter = async (id: string, generatedLetter: string) => {
  const response = await api.put(`/cover-letter/${id}`, { generatedLetter });
  return response.data;
};

export const deleteCoverLetter = async (id: string) => {
  const response = await api.delete(`/cover-letter/${id}`);
  return response.data;
};
