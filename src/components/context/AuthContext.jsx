"use client";

import { authClient } from "@/app/lib/auth-client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      const retries = 3;
      const delay = 1000;

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const { data, error: authError } = await authClient.getSession();

          if (authError) {
            throw new Error(authError.message || "Failed to fetch session data");
          }

          if (!ignore) {
            setSessionData(data);
            setError(null);
            setLoading(false);
          }
          return;
        } catch (err) {
          if (attempt === retries) {
            if (!ignore) {
              setError(err instanceof Error ? err : new Error(String(err)));
              setSessionData(null);
              setLoading(false);
            }
          } else {
            await new Promise((resolve) => setTimeout(resolve, delay * attempt));
          }
        }
      }
    }

    loadSession();

    return () => {
      ignore = true;
    };
  }, [refreshTrigger]);

  const refreshSession = useCallback(() => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const value = useMemo(() => {
    const user = sessionData?.user ?? null;
    const session = sessionData?.session ?? null;

    return {
      user,
      session,
      isAuthenticated: Boolean(user && session),
      isAdmin: user?.role === "admin",
      loading,
      error,
      refreshSession,
    };
  }, [sessionData, loading, error, refreshSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};