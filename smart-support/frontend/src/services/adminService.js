import api from './api';

export const getDashboardStats = () => api.get('/admin/dashboard').then((r) => r.data);

export const getAllUsers = () => api.get('/admin/users').then((r) => r.data);

export const getAllSchemesAdmin = () => api.get('/admin/schemes').then((r) => r.data);

export const createScheme = (payload) => api.post('/admin/schemes', payload).then((r) => r.data);

export const updateScheme = (id, payload) => api.put(`/admin/schemes/${id}`, payload).then((r) => r.data);

export const deleteScheme = (id) => api.delete(`/admin/schemes/${id}`).then((r) => r.data);

export const toggleSchemeActive = (id) => api.patch(`/admin/schemes/${id}/toggle-active`).then((r) => r.data);

export const getAllApplicationsAdmin = () => api.get('/admin/applications').then((r) => r.data);

export const updateApplicationStatus = (id, payload) =>
  api.put(`/admin/applications/${id}/status`, payload).then((r) => r.data);
