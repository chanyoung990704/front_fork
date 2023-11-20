import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/PostApiService';
import './css/Register.css'; // CSS 파일 경로 확인

import PageHeader from '../components/page-header/PageHeader';

function SignupForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setShowConfirmation(true);
    } catch (error) {
      console.error('회원가입 실패:', error);
      setErrors(error.response.data);
    }
  };

  const confirmRegistration = async () => {
    setShowConfirmation(false);
    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  return (
    <>
      <PageHeader>
        <div className="signup-form center">
          <h2 className='signup-header bottom'>Register</h2>
          <form onSubmit={handleSubmit} className="signup-form-main">
            <div className="signup-form-group bottom">
              <label htmlFor="name" className="signup-label">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="signup-input"
              />
              {errors.name && <div className="signup-error">{errors.name}</div>}
            </div>
            <div className="signup-form-group bottom">
              <label htmlFor="email" className="signup-label">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="signup-input"
              />
              {errors.email && <div className="signup-error">{errors.email}</div>}
            </div>
            <div className="signup-form-group bottom">
              <label htmlFor="password" className="signup-label">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="signup-input"
              />
              {errors.password && <div className="signup-error">{errors.password}</div>}
            </div>
            <button type="submit" className="signup-btn-primary">Register</button>
          </form>
          {showConfirmation && (
            <div className="signup-confirmation-dialog">
              <p>Would you like to join?</p>
              <button onClick={confirmRegistration} className="signup-btn-confirm">Yes</button>
              <button onClick={() => setShowConfirmation(false)} className="signup-btn-secondary">Cancel</button>
            </div>
          )}
        </div>
      </PageHeader>
    </>
  );
}

export default SignupForm;
