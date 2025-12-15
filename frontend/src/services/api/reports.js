import api from './axiosConfig';

export const getActionReports = (params = {}) =>
  api.get('/api/reports-list', { params });
