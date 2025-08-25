import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

export const loginUser = async (email: string, password: string) => {
  return axios.post(`${API_BASE_URL}/users/login`, { email, password });
};

// Ajoutez ici d'autres fonctions pour interagir avec l'API
// Exemple :
// export const getUsers = async () => axios.get(`${API_BASE_URL}/users`);
