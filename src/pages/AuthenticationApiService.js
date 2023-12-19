import { appClient } from "./ApiClient"

// JWT 인증 실행
export const executeJwtAuthenticationService = (email, password) => {
    return appClient.post('/authenticate', { email, password });
};


