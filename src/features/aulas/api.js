import { api } from "../../services/api";

const API_URL = "/api/aulas";

export const fetchAulas = async ({ page = 1, search = "" }) => {
  const { data } = await api.get(API_URL, {
    params: { page, search },
  });
  return data;
};

export const createAula = async (aulaData) => {
  const { data } = await api.post(API_URL, aulaData);
  return data;
};

export const updateAula = async ({ id, ...aulaData }) => {
  const { data } = await api.put(`${API_URL}/${id}`, aulaData);
  return data;
};

export const deleteAula = async (id) => {
  const { data } = await api.delete(`${API_URL}/${id}`);
  return data;
};
