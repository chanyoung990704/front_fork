import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

import './css/SignupComponent.css';
import PageHeader from '../components/page-header/PageHeader';

export default function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showFailMessage, setShowFailMessage] = useState(false);
    const navigate = useNavigate();
    const authContext = useAuth();

    useEffect(() => {
        if (authContext.isAuthenticated) {
            navigate('/'); // 이미 로그인한 경우 홈페이지로 리다이렉트
        }
    }, [authContext.isAuthenticated, navigate]);

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault(); // 폼의 기본 제출 이벤트 방지
        try {
            const loginSuccess = await authContext.login(email, password);
            if (loginSuccess) {
                navigate('/');
            } else {
                setShowFailMessage(true);
            }
        } catch (error) {
            console.error("Login error:", error);
            setShowFailMessage(true);
        }
    }

    function handleRegister() {
        navigate('/register');
    }

    return (
        <>
            <PageHeader>
                <div className="SignupLogin center bottom">
                    {showFailMessage && <div className="SignupErrorMessage">Authentication Failed!</div>}
                    <form className="SignupLoginForm" onSubmit={handleSubmit}>
                        {!showFailMessage && <h2 className='bottom'></h2>}
                        <div className='bottom'>
                            <label htmlFor="email">Email:</label>
                            <input id="email" type="email" name="email" placeholder='yourEmail@email.com' value={email} onChange={handleEmailChange} required />
                        </div>
                        <div className='bottom'>
                            <label htmlFor="password">Password:</label>
                            <input id="password" type="password" name="password" placeholder='*******' value={password} onChange={handlePasswordChange} required />
                        </div>
                        <div className="SignupButtonContainer">
                            <button type="submit" className="SignupButtonPrimary">
                                Login
                            </button>
                        </div>
                    </form>
                    <h3 className='bottom'>Or register if you're new here!</h3>
                    <div className="SignupButtonContainer">
                        <button onClick={handleRegister} className="SignupButtonPrimary">
                            Register
                        </button>
                    </div>
                </div>
            </PageHeader>
        </>
    );
}
