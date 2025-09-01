import api from './axiosConfig';

const crudFactory = (resource) => ({
  getAll: async () => {
    try {
      const res = await api.get(`/api/${resource}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  getOne: async (id) => {
    try {
      const res = await api.get(`/api/${resource}/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (data) => {
    try {
      const res = await api.post(`/api/${resource}`, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.post(`/api/${resource}/${id}?_method=PUT`, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  remove: async (id) => {
    try {
      const res = await api.delete(`/api/${resource}/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
});

export default crudFactory;
