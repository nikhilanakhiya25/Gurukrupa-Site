import axios from "axios";

const API = axios.create({
  baseURL: "https://gurukrupa-site-ten.vercel.app/"
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

export const imageBaseURL = process.env.REACT_APP_API_URL;

export default API;
