import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

export const getUsers = async () => {
  return axios.get(`${API_BASE_URL}/users`);
};

export const createUser = async (user: {
  email: string;
  role: string;
  temporaryPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status?: string;
  lastConnection?: string;
  createdAt?: string;
}) => {
  return axios.post(`${API_BASE_URL}/users`, user);
};

export const deleteUser = async (userId: string) => {
  return axios.delete(`${API_BASE_URL}/users/${userId}`);
};

export const updateUserRole = async (userId: string, role: string) => {
  return axios.put(`${API_BASE_URL}/users/${userId}/role`, { role });
};
