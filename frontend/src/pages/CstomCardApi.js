import axios from "axios";

const API_BASE = "/api/CustomCard"; // Uses relative URL - Nginx proxies to backend

export const getAllCustomCardsByUser = async (userId) => {
  const res = await axios.get(`${API_BASE}/user/${userId}`);
  return res.data;
};

export const getCustomCardById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export const createCustomCard = async (card, userId) => {
  const res = await axios.post(`${API_BASE}?userId=${userId}`, card);
  return res.data;
};

export const updateCustomCard = async (id, card) => {
  await axios.put(`${API_BASE}/${id}`, card);
};

export const deleteCustomCard = async (id) => {
  await axios.delete(`${API_BASE}/${id}`);
};
