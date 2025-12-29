import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true
});

// Add request interceptor to set Authorization header on each request

API.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token");

    if (token) {

      config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);

// Images are served from the same API URL under /uploads path
export const imageBaseURL = import.meta.env.VITE_API_URL;

export default API;
