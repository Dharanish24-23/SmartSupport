import api from './api';

export const submitApplication = (payload) => api.post('/applications', payload).then((r) => r.data);

export const getMyApplications = () => api.get('/applications/my').then((r) => r.data);

export const getApplicationById = (id) => api.get(`/applications/${id}`).then((r) => r.data);
