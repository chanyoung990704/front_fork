import axios from "axios";

export const appClient = axios.create({
  baseURL : 'http://18.221.102.96:8080'
});

