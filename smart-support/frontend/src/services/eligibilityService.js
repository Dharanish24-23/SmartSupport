import api from './api';

export const checkEligibility = (payload) => api.post('/eligibility/check', payload).then((r) => r.data);
