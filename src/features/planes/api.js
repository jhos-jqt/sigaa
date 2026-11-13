import { api } from "../../services/api";

const API_URL = "/api/planes";

export const fetchPlanes = async () => {
  const { data } = await api.get(API_URL);
  return data;
};

export const fetchCarrerasSelect = async () => {
  const { data } = await api.get(`${API_URL}/carreras`);
  return data;
};

export const createPlan = async (planData) => {
  const { data } = await api.post(API_URL, planData);
  return data;
};

export const updatePlan = async ({ id, ...planData }) => {
  const { data } = await api.put(`${API_URL}/${id}`, planData);
  return data;
};

export const deletePlan = async (id) => {
  await api.delete(`${API_URL}/${id}`);
};
