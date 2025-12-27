import api from './axiosConfig';

export const getEntityComments = (entityType, id, config = {}) =>
  api.get(`/api/${entityType}/${id}/comments`, config);

export const createEntityComment = (entityType, id, payload) =>
  api.post(`/api/${entityType}/${id}/comments`, payload);

export function markCommentsAsRead(commentIds = []) {
  const ids = (Array.isArray(commentIds) ? commentIds : [commentIds])
    .map((id) => Number(id))
    .filter((n) => Number.isInteger(n) && n > 0);

  // لو ما في شي غير مقروء، لا ترسل request أصلاً
  if (ids.length === 0) {
    return Promise.resolve({ data: { message: 'No comment ids to mark.' } });
  }

  return api.post('/api/comments/mark-read', {
    comment_ids: ids,
  });
}
