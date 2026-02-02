import axios from 'axios';
export const API_URL = 'https://thesnay-snayfin.hf.space/api';
// export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Global retry for network errors (429 from HF Spaces often appears as ERR_NETWORK/CORS)
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (!config || config.__retryCount >= 2) {
      return Promise.reject(error);
    }

    const isNetworkError =
      error.code === 'ERR_NETWORK' ||
      error.message === 'Network Error' ||
      (error.response && error.response.status === 429);

    if (isNetworkError) {
      config.__retryCount = (config.__retryCount || 0) + 1;
      const delay = config.__retryCount * 3000;
      await new Promise((r) => setTimeout(r, delay));
      return axios(config);
    }

    return Promise.reject(error);
  }
);

export const login = (credentials) => axios.post(`${API_URL}/users/login`, credentials);
export const register = (data) => axios.post(`${API_URL}/users/register`, data);
export const addTransaction = (data) => axios.post(`${API_URL}/transactions`, data);
export const getTransactions = (userId) => axios.get(`${API_URL}/transactions/${userId}`);
export const deleteTransaction = (id) => axios.delete(`${API_URL}/transactions/${id}`);
