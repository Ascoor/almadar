import api from './axiosConfig';


export const getActionReports = () => 
  api.get('/api/reports-list');
