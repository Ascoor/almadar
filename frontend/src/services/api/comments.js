import api from './axiosConfig';

export const getEntityComments = (entityType, id, config = {}) =>
  api.get(`/api/${entityType}/${id}/comments`, config);

export const createEntityComment = (entityType, id, payload) =>
  api.post(`/api/${entityType}/${id}/comments`, payload);
