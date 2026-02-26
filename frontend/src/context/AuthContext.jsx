import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const persistUser = (userPayload) => {
    setUser(userPayload);
    localStorage.setItem("user", JSON.stringify(userPayload));
    if (userPayload?.token) {
      localStorage.setItem("token", userPayload.token);
    }
  };

  const clearAuthStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      persistUser(data);
      return { ok: true, data };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Failed to log in. Please try again.";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      persistUser(data);
      return { ok: true, data };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Failed to register. Please try again.";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
  };

  const clearError = () => setError(null);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

