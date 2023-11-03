import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

import './css/LoginComponent.css';
import PageHeader from '../components/page-header/PageHeader';




export default function LoginComponent(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState()
    const [showFailMessage, setShowFailMessage] = useState(false)
    const navigate = useNavigate()
    const authContext = useAuth()


    function handleEmailChange(event){
        setEmail(event.target.value)
    }

    function handlePasswordChange(event){
        setPassword(event.target.value)
    }

    async function handleSubmit(){
        if(await authContext.login(email, password)){
            navigate('/')
            window.location.reload()
        }
        else{
            setShowFailMessage(true)
        }

    }

    function handleRegister(){
        navigate('/register')
    }
    


    return (
        <>
          <PageHeader>
            
            <div className="Login center bottom">
          {showFailMessage && <div className="errorMessage">Authentication Failed!!</div>}
          <div className="LoginForm">
            {!showFailMessage && <h2 className='bottom'>Sign in</h2>}
            <div className='bottom'>
              <label>Email          :</label>
              <input type="email" name="email" placeholder='yourEmail@email.com' value={email} onChange={handleEmailChange} />
            </div>
 
            <div className='bottom'>
              <label>Password   :</label>
              <input type="password" name="password" placeholder='*******' value={password} onChange={handlePasswordChange} />
            </div>
            <div className="buttonContainer">
              <button type="button" name="login" onClick={handleSubmit} className="btn btn-primary">
                Login
              </button>
            
          </div>
        </div>
        </div>
            <h3 className='bottom'>Or register if you're new here!</h3>
            <div className="buttonContainer">
              <button type="button" name="register" onClick={handleRegister} className="btn btn-primary">
                Register
              </button>
            </div>
        </PageHeader>
        </>
      );

}
