import { createContext, useContext, useEffect, useState } from "react";
import { executeJwtAuthenticationService } from "./AuthenticationApiService";
import { appClient } from "./ApiClient";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [isAuthenticated, setAuthenticate] = useState(false);
  const [email, setEmail] = useState(null);
  const [token, setToken] = useState(null);

  // 페이지가 로드될 때 로컬 스토리지에서 토큰과 로그인 상태 검색
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");

    if (storedToken && storedEmail) {
      setToken(storedToken);
      setEmail(storedEmail);
      setAuthenticate(true);

      // 토큰을 Axios 요청 헤더에 추가
      appClient.interceptors.request.use((config) => {
        console.log("intercepting and adding a token");
        config.headers.Authorization = storedToken;
        return config;
      });
    }
  }, []);

  async function login(email, password) {
    try {
      const response = await executeJwtAuthenticationService(email, password);
      if (response.status === 200) {
        const jwtToken = "Bearer " + response.data.token;
        setAuthenticate(true);
        setEmail(email);
        setToken(jwtToken);

        // 로컬 스토리지에 토큰과 이메일 저장
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("email", email);

        // Axios 요청 헤더에 토큰 추가
        appClient.interceptors.request.use((config) => {
          console.log("intercepting and adding a token");
          config.headers.Authorization = jwtToken;
          return config;
        });

        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      logout();
      return false;
    }
  }

  function logout() {
    setAuthenticate(false);
    setToken(null);
    setEmail(null);

    // 로컬 스토리지에서 토큰과 이메일 제거
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, email, token }}>
      {children}
    </AuthContext.Provider>
  );
}
