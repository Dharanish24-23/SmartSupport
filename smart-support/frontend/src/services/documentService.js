import api from './api';

export const uploadDocument = (file, documentType) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);
  return api
    .post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);
};

export const getMyDocuments = () => api.get('/documents/my').then((r) => r.data);
