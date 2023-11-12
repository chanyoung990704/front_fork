import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserLikedMovies } from '../api/PostApiService';
import { useAuth } from './AuthContext';

import './css/MovieRecommend.css';


const MovieForm = () => {
  const [selectionType, setSelectionType] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedDirector, setSelectedDirector] = useState('');
  const [userMoviesData, setUserMoviesData] = useState([]);
  // 좋아요 영화 정보가 로드되었는지 확인
  const [isLoading, setIsLoading] = useState(true);


  // 인증 관련
  const authContext = useAuth()
  const isAuthenticated = authContext.isAuthenticated

  // 사용자의 좋아요 영화목록 가져오는 함수
  const fetchUserLikedMovies = useCallback(async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const userMovies = await getUserLikedMovies();
        setUserMoviesData(userMovies.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated]);
  



  const mainGenres = ['Genre', 'Director']; // 메인 선택: 장르 또는 감독
  const subGenres = { // 세부 장르 예시
    'Action': ['Adventure', 'Superhero'],
    'Comedy': ['Romantic Comedy', 'Satire'],
    // 다른 장르에 대한 세부 장르를 추가할 수 있습니다.
  };
  const directors = ['Director A', 'Director B', 'Director C']; // 예시 감독

  const handleMainSelectionChange = (event) => {
    setSelectionType(event.target.value);
    // 메인 선택이 변경될 때 세부 선택을 초기화합니다.
    setSelectedGenres([]);
    setSelectedDirector('');
  };

  const handleSubGenreChange = (event) => {
    const value = event.target.value;
    setSelectedGenres(
      event.target.checked
        ? [...selectedGenres, value]
        : selectedGenres.filter((genre) => genre !== value)
    );
  };

  const handleDirectorChange = (event) => {
    setSelectedDirector(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      selectionType,
      genres: selectedGenres,
      director: selectedDirector,
      userLikes: userMoviesData, // userMoviesData를 requestData에 추가
    };
  
    // 이후에 이 requestData를 사용하여 API 요청을 보낼 수 있습니다.
    // 예: axios.post('api/endpoint', requestData)...
  };
  

  

  // UseEffect
  // 사용자의 좋아요 영화 목록 가져오기
  useEffect(() => {
    fetchUserLikedMovies();
  }, [isAuthenticated, fetchUserLikedMovies]);

  // 좋아요 갯수 확인하고 일정 갯수 이하면 경고창 후 메인페이지로 리다이렉트
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && userMoviesData.length <= 5) {
      alert("좋아요한 영화가 5개 이하입니다. 먼저 영화 좋아요를 해주세요.");
      navigate('/');
    }
  }, [userMoviesData, isLoading, navigate]);





  return (
    <div className="movie-form-container">
        {isLoading ? (
            <div className="loading">Loding...</div>
        ) : (
        <form onSubmit={handleSubmit} className='movie-form'>
        <h2>영화 추천</h2>

        <div>
            <h3>추천 유형 선택:</h3>
            <select value={selectionType} onChange={handleMainSelectionChange}
            className='movieFormSelect'>
            <option value="">선택하세요</option>
            {mainGenres.map((type, index) => (
                <option key={index} value={type}>{type}</option>
            ))}
            </select>
        </div>

        {selectionType === 'Genre' && (
            <div>
            <h3>세부 장르 선택:</h3>
            {Object.keys(subGenres).map((genre, index) => (
                <div key={index}>
                <strong>{genre}</strong>
                {subGenres[genre].map((subGenre, subIndex) => (
                    <label key={subIndex}>
                    <input
                        type="checkbox"
                        value={subGenre}
                        onChange={handleSubGenreChange}
                    />
                    {subGenre}
                    </label>
                ))}
                </div>
            ))}
            </div>
        )}

        {selectionType === 'Director' && (
            <div>
            <h3>감독 선택:</h3>
            <select value={selectedDirector} onChange={handleDirectorChange}
            className='movieFormSelect'>
                <option value="">감독 선택</option>
                {directors.map((director, index) => (
                <option key={index} value={director}>{director}</option>
                ))}
            </select>
            </div>
        )}

        <button type="submit" className='movieFormButton'>추천</button>
        </form>)
        }
    </div>
  );
};

export default MovieForm;
