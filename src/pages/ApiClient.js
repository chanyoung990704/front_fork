import axios from "axios";

export const appClient = axios.create({
  baseURL: 'http://59.9.96.205:8080' // 백엔드 서버의 실제 주소
  // baseURL : 'http://localhost:8080'
});

