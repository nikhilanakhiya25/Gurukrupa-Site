import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL + "/api" });

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

export const imageBaseURL = import.meta.env.VITE_API_URL;

export default API;
