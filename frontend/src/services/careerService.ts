import api from './api';

export const getCareerHistory = async () => {
  const response = await api.get('/career/history');
  return response.data;
};

export const getCareerConversation = async (id: string) => {
  const response = await api.get(`/career/history/${id}`);
  return response.data;
};

export const sendMessage = async (message: string, conversationId?: string) => {
  const response = await api.post('/career/chat', { message, conversationId });
  return response.data;
};

export const startNewConversation = async () => {
  const response = await api.post('/career/new');
  return response.data;
};

export const renameConversation = async (id: string, title: string) => {
  const response = await api.put(`/career/history/${id}/rename`, { title });
  return response.data;
};

export const deleteConversation = async (id: string) => {
  const response = await api.delete(`/career/history/${id}`);
  return response.data;
};
