import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

import './css/SignupComponent.css';
import PageHeader from '../components/page-header/PageHeader';

export default function LoginComponent() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showFailMessage, setShowFailMessage] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, login } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const loginSuccess = await login(form.email, form.password);
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

    return (
        <>
            <PageHeader>
                <div className="SignupLogin center bottom">
                    {showFailMessage && <div className="SignupErrorMessage">Authentication Failed!</div>}
                    <form className="SignupLoginForm" onSubmit={handleSubmit}>
                        <div className='bottom'>
                            <label htmlFor="email">Email:</label>
                            <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className='bottom'>
                            <label htmlFor="password">Password:</label>
                            <input id="password" type="password" name="password" value={form.password} onChange={handleChange} required />
                        </div>
                        <div className="SignupButtonContainer">
                            <button type="submit" className="SignupButtonPrimary">Login</button>
                        </div>
                        <h3 className='bottom'>Or register if you're new here!</h3>
                        <div className="SignupButtonContainer">
                            <button onClick={() => navigate('/register')} className="SignupButtonPrimary">Register</button>
                        </div>
                    </form>
                </div>
            </PageHeader>
        </>
    );
}
