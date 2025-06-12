"use client";

import { deleteCookie, getCookie, setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import api, { ACCESS_TOKEN_COOKIE } from "../utils/requestUtils";

interface AuthContextType {
  isLoading: boolean;
  login: (
    username: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  register: (
    fullName: string,
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load by checking cookies
    const checkAuth = async () => {
      try {
        const accessToken = getCookie(ACCESS_TOKEN_COOKIE);
        if (!accessToken) {
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error("Authentication error:", error);
        deleteCookie(ACCESS_TOKEN_COOKIE);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (
    username: string,
    password: string,
    rememberMe = false
  ) => {
    setIsLoading(true);
    try {
      const response = await api.post<{ accessToken: string }>(
        "/api/account/login",
        {
          username,
          password,
        }
      );

      // Save token to cookie
      const tokenExpiry = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 24 hours
      setCookie(ACCESS_TOKEN_COOKIE, response.accessToken, {
        maxAge: tokenExpiry,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    } catch (error) {
      console.error("111-Login failed:", error);
      throw error; // Re-throw to be handled by the login component
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    fullName: string,
    username: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      await api.post("/api/account/register", {
        name: fullName,
        username,
        password,
      });
    } catch (error) {
      console.error("111-Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    deleteCookie(ACCESS_TOKEN_COOKIE);
  };

  return (
    <AuthContext.Provider value={{ isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
