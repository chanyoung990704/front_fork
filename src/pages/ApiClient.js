import axios from "axios";

export const appClient = axios.create({
  baseURL: 'http://localhost:8080'
});

let logoutFunction = null;

// AuthContext에서 logout 함수를 설정합니다.
export function setAuthLogout(logoutFunc) {
  logoutFunction = logoutFunc;
}

// 응답 인터셉터를 추가하여 401 응답을 처리합니다.
appClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401 && logoutFunction) {
      logoutFunction();
    }
    return Promise.reject(error);
  }
);
