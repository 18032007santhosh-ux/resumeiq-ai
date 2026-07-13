import api from './api';

export const getHistoryTimeline = async () => {
  const response = await api.get('/history');
  return response.data;
};

export const getHistoryItem = async (id: string) => {
  const response = await api.get(`/history/${id}`);
  return response.data;
};

export const deleteHistoryItem = async (id: string) => {
  const response = await api.delete(`/history/${id}`);
  return response.data;
};
