import axios from "axios";

export const appClient = axios.create({
  baseURL : 'http://3.18.110.67:8080'
});

