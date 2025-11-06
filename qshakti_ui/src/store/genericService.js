import axios from "axios";
import config from "../config";
import { handleTokenExpiration } from "../utils/tokenUtils";

const BASE_URL = config.apiUrl;

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const skipCredentialsEndpoints = [
  "auth/forgot-password/",
  "auth/reset-password",
];

axiosInstance.interceptors.request.use(
  (config) => {
    // Check if the request URL matches any in the list
    if (
      skipCredentialsEndpoints.some((endpoint) =>
        config.url?.includes(endpoint)
      )
    ) {
      config.withCredentials = false;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle expired access token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await axios.post(
          `${BASE_URL}/auth/token/refresh/`,
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Retry original request after successful token refresh
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (
          refreshError.response?.status === 401 ||
          refreshError.response?.status === 403
        ) {
          handleTokenExpiration();
        }

        return Promise.reject(refreshError);
      }
    }

    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;

    //   // Check if refresh token exists in cookies
    //   const refreshToken = getCookie("refresh");
    //   console.log(refreshToken);
    //   if (!refreshToken) {
    //     handleTokenExpiration(); // Log out the user
    //     return Promise.reject(error);
    //   }

    //   try {
    //     // Attempt to refresh token
    //     await axios.post(
    //       `${BASE_URL}/auth/token/refresh/`,
    //       {},
    //       {
    //         withCredentials: true,
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );

    //     // Retry original request after successful token refresh
    //     return axiosInstance(originalRequest);
    //   } catch (refreshError) {
    //     // Handle refresh token expiration or invalidity
    //     if (
    //       refreshError.response?.status === 401 ||
    //       refreshError.response?.status === 403
    //     ) {
    //       handleTokenExpiration();
    //     }

    //     return Promise.reject(refreshError);
    //   }
    // }

    return Promise.reject(error);
  }
);

// === API SERVICE METHODS ===
const apiService = {
  get: (url, params = {}) => axiosInstance.get(url, { params }),
  post: (url, data) =>
    axiosInstance.post(
      url,
      data instanceof FormData ? data : JSON.stringify(data),
      {
        headers: {
          "Content-Type":
            data instanceof FormData
              ? "multipart/form-data"
              : "application/json",
          // withCredentials: true,
        },
      }
    ),
  post1: (url, data) =>
    axiosInstance.post(url, data, {
      headers: {
        "Content-Type":
          data instanceof FormData ? "multipart/form-data" : "application/json",
      },
    }),
  put: (url, data) =>
    axiosInstance.put(url, data, {
      headers: {
        "Content-Type":
          data instanceof FormData ? "multipart/form-data" : "application/json",
      },
    }),
  delete: (url) => axiosInstance.delete(url),
  delete1: (url, data = {}, config = {}) =>
    axiosInstance.delete(url, {
      ...config,
      data,
    }),
  update: (url, data) =>
    axiosInstance.put(url, JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }),
  update1: (url, data, config = {}) => axiosInstance.put(url, data, config),
  putwithformMethod: (url, data) =>
    axiosInstance.put(url, data, {
      headers: {
        "Content-Type":
          data instanceof FormData ? "multipart/form-data" : "application/json",
      },
    }),
};

export default apiService;
