import api from './api';

export const getOfficerApplications = () => api.get('/officer/applications').then((r) => r.data);

export const updateOfficerApplicationStatus = (id, status) =>
  api.put(`/officer/applications/${id}/status`, { status }).then((r) => r.data);
