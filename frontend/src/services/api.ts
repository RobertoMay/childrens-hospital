import axios from 'axios';
import { API_BASE_URL } from '../lib/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        'Error de API:',
        error.response.status,
        error.response.data
      );
    } else {
      console.error('Error de conexión:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
