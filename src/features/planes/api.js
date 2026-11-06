import { api } from "../../services/api";

const API_URL = "/api/planes";

export const fetchPlanes = async ({ page = 1, search = "" }) => {
  const { data } = await api.get(API_URL, { params: { page, search } });
  return data;
};

// Obtener lista simple de carreras para el select
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
