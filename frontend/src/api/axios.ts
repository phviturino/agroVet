import axios from "axios";

export const api = axios.create({
  baseURL: "/api"
});

// Adiciona automaticamente o JWT às requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});