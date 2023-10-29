import { appClient } from "../pages/ApiClient";


export const register = (registerForm) => appClient.post('/api/register', registerForm)
export const likes = (category, id) => appClient.post(`/api/${category}/like/${id}`)
export const movieSearch = (keyword) => appClient.get(`/autocomplete/search?prefix=${keyword}`)