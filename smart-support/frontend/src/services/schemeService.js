import api from './api';

export const getAllSchemes = () => api.get('/schemes').then((r) => r.data);

export const getSchemeById = (id) => api.get(`/schemes/${id}`).then((r) => r.data);
