import { api } from "../../services/api";

const API_URL = "/api/carreras";

export const fetchCarreras = async ({ page = 1, search = "" }) => {
  const { data } = await api.get(API_URL, {
    params: { page, search },
  });
  return data;
};

export const createCarrera = async (carreraData) => {
  const { data } = await api.post(API_URL, carreraData);
  return data;
};

export const updateCarrera = async ({ id, formData }) => {
  formData.append("_method", "PUT");

  const { data } = await api.post(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteCarrera = async (id) => {
  const { data } = await api.delete(`${API_URL}/${id}`);
  return data;
};
