import api from './api';

export const compareResumes = async (resumeId1: string, resumeId2: string) => {
  const response = await api.post('/compare', { resumeId1, resumeId2 });
  return response.data;
};

export const getComparisons = async () => {
  const response = await api.get('/compare');
  return response.data;
};

export const getComparisonById = async (id: string) => {
  const response = await api.get(`/compare/${id}`);
  return response.data;
};

export const deleteComparison = async (id: string) => {
  const response = await api.delete(`/compare/${id}`);
  return response.data;
};
