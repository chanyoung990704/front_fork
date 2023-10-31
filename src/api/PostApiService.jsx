import { appClient } from "../pages/ApiClient";


export const register = (registerForm) => appClient.post('/api/register', registerForm)
export const likes = (category, id) => appClient.post(`/api/${category}/like/${id}`)
export const dislikes = (category, id) => appClient.post(`/api/${category}/likecancel/${id}`)
export const movieSearch = (keyword) => appClient.get(`/autocomplete/search?prefix=${keyword}`)
export const getUserLikedMovies = () => appClient.get(`/api/member/likemovie`)