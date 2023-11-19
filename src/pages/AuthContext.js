import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { executeJwtAuthenticationService } from "./AuthenticationApiService";
import { appClient } from "./ApiClient";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [isAuthenticated, setAuthenticate] = useState(!!localStorage.getItem("token"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setAuthenticate(false);
    setToken(null);
    setEmail(null);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await executeJwtAuthenticationService(email, password);
      if (response.status === 200) {
        const jwtToken = response.data.token;
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("email", email);
        setToken(jwtToken);
        setEmail(email);
        setAuthenticate(true);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      setError(error);
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");

    if (storedToken && storedEmail) {
      setToken(storedToken);
      setEmail(storedEmail);
      setAuthenticate(true);
    }
    setLoading(false);

    const requestInterceptor = appClient.interceptors.request.use((config) => {
      const localToken = localStorage.getItem("token");
      if (localToken) {
        config.headers.Authorization = `Bearer ${localToken}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    return () => {
      appClient.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, email, token, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
