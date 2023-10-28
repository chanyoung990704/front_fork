import { appClient } from "./ApiClient"




export function executeBasicAuthenticationService(token){

    return appClient.get('/basicauth', {
        headers:{
            Authorization: token
        }
    })
}

export const executeJwtAuthenticationService
    = (email, password) => appClient.post('/authenticate', {email, password})