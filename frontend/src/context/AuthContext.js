"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register User
  const register = async (formData) => {
    const { data } = await api.post("/auth/signup", formData);

    return data;
  };

  // Login User
  const login = async (formData) => {
    const { data } = await api.post("/auth/login", formData);

    await getCurrentUser();

    return data;
  };

  // Logout User
  const logout = async () => {
    const { data } = await api.post("/auth/logout");

    setUser(null);

    return data;
  };

  // Get Logged In User
  const getCurrentUser = async () => {
    try {
      const { data } = await api.get("/auth/me");

      setUser(data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication when app loads
  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
