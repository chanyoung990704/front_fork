import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { executeJwtAuthenticationService } from "./AuthenticationApiService";
import { appClient } from "./ApiClient";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = "token";
const EMAIL_KEY = "email";

export default function AuthProvider({ children }) {
  const [isAuthenticated, setAuthenticate] = useState(!!localStorage.getItem(TOKEN_KEY));
  const [email, setEmail] = useState(localStorage.getItem(EMAIL_KEY));
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 로그아웃 함수
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setAuthenticate(false);
    setToken(null);
    setEmail(null);
  }, []);

  // 로그인 함수
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await executeJwtAuthenticationService(email, password);
      if (response.status === 200) {
        const jwtToken = response.data.token;
        localStorage.setItem(TOKEN_KEY, jwtToken);
        localStorage.setItem(EMAIL_KEY, email);
        setToken(jwtToken);
        setEmail(email);
        setAuthenticate(true);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      setError("Login failed");
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // 초기 상태 설정 및 인터셉터 구성
  useEffect(() => {
    setLoading(false);

    const requestInterceptor = appClient.interceptors.request.use((config) => {
      const localToken = localStorage.getItem(TOKEN_KEY);
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
