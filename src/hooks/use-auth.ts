"use client";

import { tokenUtils } from "@/components/utils/requestUtils";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = tokenUtils.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    const handleTokenUpdate = () => {
      checkAuth();
    };

    window.addEventListener("tokenUpdate", handleTokenUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenUpdate", handleTokenUpdate);
    };
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    tokenUtils.setTokens(accessToken, refreshToken);
    setIsAuthenticated(true);

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent("tokenUpdate"));
  };

  const logout = () => {
    tokenUtils.clearTokens();
    setIsAuthenticated(false);

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent("tokenUpdate"));

    // Redirect to login
    window.location.href = "/login";
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    accessToken: tokenUtils.getAccessToken(),
    refreshToken: tokenUtils.getRefreshToken(),
  };
};
