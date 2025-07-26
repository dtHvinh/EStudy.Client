import { StatusCodes } from "@/types/constants";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next/client";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

export interface RequestOptions extends AxiosRequestConfig {
  withAuth?: boolean;
  skipErrorHandling?: boolean;
  skipTokenRefresh?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;
let redirectTriggered = false;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getCookie(REFRESH_TOKEN_COOKIE);
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/account/refresh-token`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    setCookie(ACCESS_TOKEN_COOKIE, accessToken, {
      maxAge: 15 * 60, // 15 minutes
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    if (newRefreshToken) {
      setCookie(REFRESH_TOKEN_COOKIE, newRefreshToken, {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }

    return accessToken;
  } catch (error) {
    deleteCookie(ACCESS_TOKEN_COOKIE);
    deleteCookie(REFRESH_TOKEN_COOKIE);

    if (typeof window !== "undefined" && !redirectTriggered) {
      redirectTriggered = true;
      window.location.href = "/login";
    }

    throw error;
  }
};

axiosInstance.interceptors.request.use((config) => {
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
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config!;
    const status = error.response?.status;

    if (status === StatusCodes.AccountBanned) {
      if (typeof window !== "undefined" && !redirectTriggered) {
        redirectTriggered = true;
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (status === 401) {
      const config = originalRequest as RequestOptions;
      if (config.skipTokenRefresh) {
        return Promise.reject(error);
      }

      // If no refresh in progress, start one
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken()
          .then((token) => {
            refreshPromise = null;
            return token;
          })
          .catch((err) => {
            refreshPromise = null;
            throw err;
          });
      }

      return refreshPromise.then((newToken) => {
        // Update the original request with the new token
        if (originalRequest.headers && newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return axiosInstance(originalRequest);
      });
    }

    const customConfig = error.config as RequestOptions;
    if (customConfig?.skipErrorHandling) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

const handleResponse = <T>(response: AxiosResponse): T => {
  return response.data;
};

const containsFiles = (data: any): boolean => {
  if (data instanceof FormData) return true;
  if (data instanceof File) return true;
  if (data instanceof FileList) return true;

  if (typeof data === "object" && data !== null) {
    for (const key in data) {
      if (data[key] instanceof File || data[key] instanceof FileList) {
        return true;
      }
      if (typeof data[key] === "object" && containsFiles(data[key])) {
        return true;
      }
    }
  }

  return false;
};

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

export async function get<T = any>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await axiosInstance.get(url, options);
  return handleResponse<T>(response);
}

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

export async function put<T = any>(
  url: string,
  data?: any,
  options: RequestOptions = {},
): Promise<T> {
  const response = await axiosInstance.put(url, data, options);
  return handleResponse<T>(response);
}

export async function patch<T = any>(
  url: string,
  data?: any,
  options: RequestOptions = {},
): Promise<T> {
  const response = await axiosInstance.patch(url, data, options);
  return handleResponse<T>(response);
}

export async function del<T = any>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await axiosInstance.delete(url, options);
  return handleResponse<T>(response);
}

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

export const tokenUtils = {
  setTokens: (accessToken: string, refreshToken: string) => {
    setCookie(ACCESS_TOKEN_COOKIE, accessToken, {
      maxAge: 15 * 60,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    setCookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      maxAge: 7 * 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },

  clearTokens: () => {
    deleteCookie(ACCESS_TOKEN_COOKIE);
    deleteCookie(REFRESH_TOKEN_COOKIE);
  },

  getAccessToken: () => getCookie(ACCESS_TOKEN_COOKIE),
  getRefreshToken: () => getCookie(REFRESH_TOKEN_COOKIE),

  isAuthenticated: () => {
    return (
      !!getCookie(ACCESS_TOKEN_COOKIE) || !!getCookie(REFRESH_TOKEN_COOKIE)
    );
  },
};

export default api;
