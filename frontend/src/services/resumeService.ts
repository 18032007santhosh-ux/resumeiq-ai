import api from './api';

export const uploadResumeFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/resumes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getResumes = async () => {
  const response = await api.get('/resumes');
  return response.data;
};

export const getResumeById = async (id: string) => {
  const response = await api.get(`/resumes/${id}`);
  return response.data;
};

export const deleteResume = async (id: string) => {
  const response = await api.delete(`/resumes/${id}`);
  return response.data;
};
