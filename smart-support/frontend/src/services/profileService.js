import api from './api';

export const getProfile = () => api.get('/profile').then((response) => response.data);
export const updateProfile = (payload) => api.put('/profile', payload).then((response) => response.data);
