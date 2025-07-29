import axios, {
  type AxiosResponse,
  type AxiosError,
  type AxiosInstance,
} from "axios";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error("API Error:", error.message);

    return Promise.reject(new Error(error.message));
  }
);

export const client = {
  get: <T>(url: string, params?: object) =>
    axiosInstance.get<T>(url, { params }),

  post: <T>(url: string, data?: object) => axiosInstance.post<T>(url, data),

  put: <T>(url: string, data?: object) => axiosInstance.put<T>(url, data),

  delete: <T>(url: string) => axiosInstance.delete<T>(url),

  patch: <T>(url: string, data?: object) => axiosInstance.patch<T>(url, data),
};
