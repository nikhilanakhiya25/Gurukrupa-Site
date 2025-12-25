import axios from "axios";

const API = axios.create({
  baseURL: "https://gurukrupa-site-giftarticle.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  },
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

export const imageBaseURL = "https://gurukrupa-site-giftarticle.onrender.com";

export default API;
