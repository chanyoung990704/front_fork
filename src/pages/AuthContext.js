// Create a Context

import { createContext, useContext, useState } from "react";
import { executeJwtAuthenticationService } from "./AuthenticationApiService";
import { appClient } from "./ApiClient";

export const AuthContext = createContext()

export const useAuth  = () => useContext(AuthContext) 


// Put some state in the context


// Share the created context with other components

export default function AuthProvider({children}){


    const[isAuthenticated, setAuthenticate] = useState(false)

    const[email, setEmail] = useState(null)

    const[token, setToken] = useState(null)



    async function login(email, password){



        try{

            const response = await executeJwtAuthenticationService(email, password)
            if(response.status == 200){
                const jwtToken = 'Bearer ' + response.data.token
                setAuthenticate(true)
                setEmail(email)
                setToken(jwtToken)

                appClient.interceptors.request.use(
                    (config) =>{
                        console.log('intercepting and adding a token')
                        config.headers.Authorization = jwtToken
                        return config
                    }
                )

                return true
            }else{
                logout()
                return false
            }


        }catch(error){
            logout()
            return false
        }
    
    
    }
    


    function logout(){
        setAuthenticate(false)
        setToken(null)
        setEmail(null)
    }


    return(

        <AuthContext.Provider value={ {isAuthenticated, login, logout, email, token} }>
            {children}
        </AuthContext.Provider>


    )


}