import { appClient } from "../pages/ApiClient";


export const register = (registerForm) => appClient.post('/api/register', registerForm)
export const likes = (category, id) => appClient.post(`/api/${category}/${id}`)