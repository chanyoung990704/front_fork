import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/PostApiService';
import './css/Register.css'

import PageHeader from '../components/page-header/PageHeader';


function SignupForm() {
  const navigate = useNavigate();
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

    // 여기에서 formData를 사용하여 회원가입 또는 데이터 처리 로직을 구현합니다.
    try {
      // 회원가입을 요청하기 전에 확인 다이얼로그를 표시합니다.
      setShowConfirmation(true);
    } catch (error) {
      console.error('회원가입 실패:', error);
      // 실패 시 처리를 구현합니다.
    }
  };

  const confirmRegistration = async () => {
    setShowConfirmation(false); // 확인 다이얼로그를 닫습니다.

    // 실제 회원가입 요청을 보냅니다.
    try {
      await register(formData);
      console.log('회원가입 완료');
      // 회원가입이 성공하면 '/'로 페이지를 이동합니다.
      navigate('/');
    } catch (error) {
      console.error('회원가입 실패:', error);
      // 실패 시 처리를 구현합니다.
      // 어떤 이유로 회원가입이 실패했는 지 에러메세지 노출시켜야 함
    }
  };

  return (
    <>
    <PageHeader>
    <div className="signup-form center">
      <h2 className='bottom'>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group bottom">
          <label htmlFor="name">Name           :</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control" // Bootstrap 클래스 추가
          />
        </div>
        <div className="form-group bottom">
          <label htmlFor="email">Email           :</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control" // Bootstrap 클래스 추가
          />
        </div>
        <div className="form-group bottom">
          <label htmlFor="password">Password    :</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-control" // Bootstrap 클래스 추가
          />
        </div>
        <button type="submit" className="btn btn-primary">가입하기</button> {/* Bootstrap 클래스 추가 */}
      </form>

      {/* 확인 다이얼로그 */}
      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>가입하시겠습니까?</p>
          <button onClick={confirmRegistration} className="primary">확인</button>
          <button onClick={() => setShowConfirmation(false)} className="secondary">취소</button>
        </div>
      )}
    </div>
    </PageHeader>
    </>
  );
}

export default SignupForm;
