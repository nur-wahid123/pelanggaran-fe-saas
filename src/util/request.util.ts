import axios from "axios";
import Cookies from "js-cookie";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function logout() {
  if (typeof window !== "undefined") {
    Cookies.remove("token");
    localStorage.removeItem("token");
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      if (typeof window !== "undefined") {
        const slug = localStorage.getItem("schoolSlug");
        Cookies.remove("token");
        localStorage.removeItem("token");
        if (slug) {
          window.location.href = `/login/${slug}`;
        } else {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);
