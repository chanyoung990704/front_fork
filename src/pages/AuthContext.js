import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { executeJwtAuthenticationService } from "./AuthenticationApiService";
import { appClient, setAuthLogout } from "./ApiClient";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [isAuthenticated, setAuthenticate] = useState(!!localStorage.getItem("token"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    setAuthenticate(false);
    setToken(null);
    setEmail(null);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  }, []);

  useEffect(() => {
    setAuthLogout(logout);
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");

    if (storedToken && storedEmail) {
      setToken(storedToken);
      setEmail(storedEmail);
      setAuthenticate(true);
    }
    setLoading(false);

    const requestInterceptor = appClient.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    return () => {
      appClient.interceptors.request.eject(requestInterceptor);
    };
}, [token, logout]);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await executeJwtAuthenticationService(email, password);
      if (response.status === 200) {
        const jwtToken = "Bearer " + response.data.token;
        setAuthenticate(true);
        setEmail(email);
        setToken(jwtToken);

        localStorage.setItem("token", jwtToken);
        localStorage.setItem("email", email);
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, email, token, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
