import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getCookie } from "cookies-next/client";

// API base URL from environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error: AxiosError) {
    // Skip error handling if explicitly requested
    const customConfig = error.config as RequestOptions;
    if (customConfig?.skipErrorHandling) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
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

  const appendToFormData = (obj: any, formData: FormData, prefix = "") => {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      const value = obj[key];
      const formKey = prefix ? `${prefix}.${key}` : key;

      if (value instanceof File) {
        formData.append(formKey, value);
      } else if (value instanceof FileList) {
        for (let i = 0; i < value.length; i++) {
          formData.append(`${formKey}[${i}]`, value[i]);
        }
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayKey = `${formKey}[${index}]`;
          if (typeof item === "object" && item !== null) {
            appendToFormData(item, formData, arrayKey);
          } else {
            formData.append(arrayKey, item);
          }
        });
      } else if (typeof value === "object" && value !== null) {
        appendToFormData(value, formData, formKey);
      } else if (value !== null && value !== undefined) {
        formData.append(formKey, value.toString());
      }
    }
  };

  appendToFormData(data, formData);
  return formData;
};

/**
 * HTTP GET request
 */
export async function get<T = any>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await axiosInstance.get(url, options);
  return handleResponse<T>(response);
}

/**
 * HTTP POST request
 */
export async function post<T = any>(
  url: string,
  data?: any,
  options: RequestOptions = {},
): Promise<T> {
  const response = await axiosInstance.post(url, data, options);
  return handleResponse<T>(response);
}

export async function postWithFormData<T = any>(
  url: string,
  data: any,
  options: RequestOptions = {},
): Promise<T> {
  const formData = prepareFormData(data);
  const response = await axiosInstance.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...options,
  });
  return handleResponse<T>(response);
}

export async function putWithFormData<T = any>(
  url: string,
  data: any,
  options: RequestOptions = {},
): Promise<T> {
  const formData = prepareFormData(data);
  const response = await axiosInstance.put(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...options,
  });
  return handleResponse<T>(response);
}

/**
 * HTTP PUT request
 */
export async function put<T = any>(
  url: string,
  data?: any,
  options: RequestOptions = {},
): Promise<T> {
  const response = await axiosInstance.put(url, data, options);
  return handleResponse<T>(response);
}

/**
 * HTTP PATCH request
 */
export async function patch<T = any>(
  url: string,
  data?: any,
  options: RequestOptions = {},
): Promise<T> {
  const response = await axiosInstance.patch(url, data, options);
  return handleResponse<T>(response);
}

/**
 * HTTP DELETE request
 */
export async function del<T = any>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await axiosInstance.delete(url, options);
  return handleResponse<T>(response);
}

/**
 * Upload files using FormData
 */
export async function uploadFile<T = any>(
  url: string,
  formData: FormData,
  options: RequestOptions = {},
): Promise<T> {
  const response = await axiosInstance.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...options,
  });
  return handleResponse<T>(response);
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
