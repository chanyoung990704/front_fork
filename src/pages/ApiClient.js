import axios from "axios";

export const appClient = axios.create({
  baseURL: 'http://localhost:8080'
});

