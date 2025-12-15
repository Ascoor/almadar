import api from './axiosConfig';

export const fetchAssignableUsers = (context, q = '') =>
  api.get('/api/assignable-users', {
    params: { context, q },
  });

export const assignEntity = (entityType, id, assignedToUserId) =>
  api.patch(`/api/${entityType}/${id}/assign`, {
    assigned_to_user_id: assignedToUserId,
  });

