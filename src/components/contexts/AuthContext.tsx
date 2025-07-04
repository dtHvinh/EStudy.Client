"use client";

import { deleteCookie, getCookie } from "cookies-next/client";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { mutate } from "swr";
import { ACCESS_TOKEN_COOKIE } from "../utils/requestUtils";

interface AuthContextType {
  isLoading: boolean;
  logout: () => void;
  getId: () => string;
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

  const logout = () => {
    deleteCookie(ACCESS_TOKEN_COOKIE);
    mutate(() => true, undefined, { revalidate: false });
    router.push("/login");
  };

  const getId = () => {
    const accessToken = `${getCookie(ACCESS_TOKEN_COOKIE)}`;
    const decoded = jwtDecode<JwtPayload & { nameid: string }>(accessToken);
    return decoded["nameid"] as string;
  };

  return (
    <AuthContext.Provider value={{ isLoading, logout, getId }}>
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
