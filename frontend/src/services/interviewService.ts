import api from './api';

export const generateInterview = async (resumeId: string, jobMatchId: string | null, difficulty: string, questionCount: number) => {
  const response = await api.post('/interview/generate', {
    resumeId,
    jobMatchId,
    difficulty,
    questionCount,
  });
  return response.data;
};

export const submitInterview = async (sessionId: string, userAnswers: { questionIndex: number; answer: string }[]) => {
  const response = await api.post('/interview/submit', {
    sessionId,
    userAnswers,
  });
  return response.data;
};

export const getInterviewHistory = async () => {
  const response = await api.get('/interview/history');
  return response.data;
};

export const getInterviewById = async (id: string) => {
  const response = await api.get(`/interview/${id}`);
  return response.data;
};

export const deleteInterview = async (id: string) => {
  const response = await api.delete(`/interview/${id}`);
  return response.data;
};
