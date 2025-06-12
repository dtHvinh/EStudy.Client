import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getCookie } from "cookies-next/client";

// API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Cookie name for storing the access token
export const ACCESS_TOKEN_COOKIE = "accessToken";

// Extended Axios request config with our custom options
export interface RequestOptions extends AxiosRequestConfig {
  withAuth?: boolean;
  skipErrorHandling?: boolean;
}

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to automatically add auth token
axiosInstance.interceptors.request.use((config) => {
  // Only add auth header if withAuth is not explicitly set to false
  const customConfig = config as RequestOptions;
  if (customConfig.withAuth !== false) {
    const token = getCookie(ACCESS_TOKEN_COOKIE);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Skip error handling if explicitly requested
    const customConfig = error.config as RequestOptions;
    if (customConfig?.skipErrorHandling) {
      return Promise.reject(error);
    }

    console.error("API request failed:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Helper function to handle responses and extract data
const handleResponse = <T>(response: AxiosResponse): T => {
  return response.data;
};

// Helper function to detect if data contains files
const containsFiles = (data: any): boolean => {
  if (data instanceof FormData) return true;
  if (data instanceof File) return true;
  if (data instanceof FileList) return true;

  // Check for File objects in nested data
  if (typeof data === "object" && data !== null) {
    for (const key in data) {
      if (data[key] instanceof File || data[key] instanceof FileList) {
        return true;
      }
      // Check for nested objects/arrays
      if (typeof data[key] === "object" && containsFiles(data[key])) {
        return true;
      }
    }
  }

  return false;
};

// Helper function to convert data with files to FormData
const prepareFormData = (data: any): FormData => {
  if (data instanceof FormData) {
    return data;
  }

  const formData = new FormData();

  const appendToFormData = (obj: any, prefix = "") => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const formKey = prefix ? `${prefix}[${key}]` : key;

        if (value instanceof File) {
          formData.append(formKey, value);
        } else if (value instanceof FileList) {
          for (let i = 0; i < value.length; i++) {
            formData.append(`${formKey}[${i}]`, value[i]);
          }
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === "object" && item !== null) {
              appendToFormData(item, `${formKey}[${index}]`);
            } else {
              formData.append(`${formKey}[${index}]`, item);
            }
          });
        } else if (typeof value === "object" && value !== null) {
          appendToFormData(value, formKey);
        } else if (value !== null && value !== undefined) {
          formData.append(formKey, value.toString());
        }
      }
    }
  };

  appendToFormData(data);
  return formData;
};

/**
 * HTTP GET request
 */
export function get<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  return axiosInstance
    .get(url, options)
    .then((response) => handleResponse<T>(response));
}

/**
 * HTTP POST request
 */
export function post<T = any>(
  url: string,
  data?: any,
  options: RequestOptions = {}
): Promise<T> {
  // Handle file uploads automatically
  if (data && containsFiles(data)) {
    const formData = prepareFormData(data);
    return axiosInstance
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        ...options,
      })
      .then((response) => handleResponse<T>(response));
  }

  // Regular JSON post
  return axiosInstance
    .post(url, data, options)
    .then((response) => handleResponse<T>(response));
}

export function postWithFormData<T = any>(
  url: string,
  data: any,
  options: RequestOptions = {}
): Promise<T> {
  const formData = prepareFormData(data);
  return axiosInstance
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...options,
    })
    .then((response) => handleResponse<T>(response));
}

export function putWithFormData<T = any>(
  url: string,
  data: any,
  options: RequestOptions = {}
): Promise<T> {
  const formData = prepareFormData(data);
  return axiosInstance
    .put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...options,
    })
    .then((response) => handleResponse<T>(response));
}

/**
 * HTTP PUT request
 */
export function put<T = any>(
  url: string,
  data?: any,
  options: RequestOptions = {}
): Promise<T> {
  return axiosInstance
    .put(url, data, options)
    .then((response) => handleResponse<T>(response));
}

/**
 * HTTP PATCH request
 */
export function patch<T = any>(
  url: string,
  data?: any,
  options: RequestOptions = {}
): Promise<T> {
  return axiosInstance
    .patch(url, data, options)
    .then((response) => handleResponse<T>(response));
}

/**
 * HTTP DELETE request
 */
export function del<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  return axiosInstance
    .delete(url, options)
    .then((response) => handleResponse<T>(response));
}

/**
 * Upload files using FormData
 */
export function uploadFile<T = any>(
  url: string,
  formData: FormData,
  options: RequestOptions = {}
): Promise<T> {
  return axiosInstance
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...options,
    })
    .then((response) => handleResponse<T>(response));
}

// Export functions as an object for easier imports
const api = {
  get,
  post,
  put,
  patch,
  delete: del,
  uploadFile,
  postWithFormData,
  putWithFormData,
};

export default api;
