import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserLikedMovies, recommendMovie } from '../api/PostApiService';
import { useAuth } from './AuthContext';
import { useLikedMovies } from './LikedMoviesContext';
import { useRecommendedMovies } from './RecommendedMovieContext';

import './css/MovieRecommend.css';


const MovieForm = () => {
  const [selectionType, setSelectionType] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedDirector, setSelectedDirector] = useState('');
  //navigate
  const navigate = useNavigate();

  // 좋아요 영화 정보가 로드되었는지 확인
  const [isLoading, setIsLoading] = useState(true);

  // 추천 영화 목록
  const { recommendedMovies, fetchRecommendedMovies } = useRecommendedMovies();

  const [showLowLikesWarning, setShowLowLikesWarning] = useState(false);



  // 인증 관련
  const authContext = useAuth()
  const isAuthenticated = authContext.isAuthenticated

  // 전역 상태 사용
  const { likedMovies, setLikedMovies } = useLikedMovies(); // 전역 상태 사용

  // 사용자의 좋아요 영화목록 가져오는 함수
  const fetchUserLikedMovies = useCallback(async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const userMovies = await getUserLikedMovies();
        setLikedMovies(userMovies.data); // 전역 상태 업데이트
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, setLikedMovies]);
  



  const mainGenres = ['Genre', 'Director']; // 메인 선택: 장르 또는 감독
  const genres = [
    'Thriller', 'Western', 'Adventure', 'Fantasy', 'Drama',
    '(no genres listed)', 'Animation', 'Action', 'Crime',
    'Documentary', 'Comedy', 'Sci-Fi', 'War', 'Musical',
    'Film-Noir', 'Horror', 'Mystery', 'Children', 'Romance', 'IMAX'
  ];
  const directors = ['Director A', 'Director B', 'Director C']; // 예시 감독

  const handleMainSelectionChange = (event) => {
    setSelectionType(event.target.value);
    // 메인 선택이 변경될 때 세부 선택을 초기화합니다.
    setSelectedGenres([]);
    setSelectedDirector('');
  };

  const handleGenreChange = (event) => {
    const value = event.target.value;
    const newSelectedGenres = event.target.checked
      ? [...selectedGenres, value]
      : selectedGenres.filter((genre) => genre !== value);
  
    setSelectedGenres(newSelectedGenres);
  };
  

  const handleDirectorChange = (event) => {
    setSelectedDirector(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestData = {
      selectionType,
      genres: selectedGenres,
      director: selectedDirector,
      userLikes: likedMovies, // userMoviesData를 requestData에 추가
    };
  
    try {
      // API 요청을 보냅니다.
      const response = await recommendMovie(requestData);
      console.log(response.data);

      // fetchRecommendedMovies가 비동기 함수라면 아래와 같이 처리합니다.
      await fetchRecommendedMovies();

      // 추천된 영화 목록을 로컬 스토리지에 저장
      localStorage.setItem('recommendedMovies', JSON.stringify(recommendedMovies));

      // 페이지 이동
      navigate('/'); // 추천된 영화 목록을 보여주는 페이지로 이동
    } catch (error) {
      // 에러 처리
      console.error('Error during API request:', error);
    }
  };

  const handleCloseWarning = () => {
    setShowLowLikesWarning(false);
    navigate('/');
  };
  

  // UseEffect
  // 사용자의 좋아요 영화 목록 가져오기
  useEffect(() => {
    fetchUserLikedMovies();
  }, [isAuthenticated, fetchUserLikedMovies]);

  // 좋아요 갯수 확인하고 일정 갯수 이하면 경고창 후 메인페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && likedMovies.length <= 5) {
      setShowLowLikesWarning(true);
    }
  }, [likedMovies, isLoading]);







  return (
    <div className="movie-form-container">
      {isLoading ? (
        <div className="loading">Loading...</div>
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

      {/* 세부 장르 선택 부분 */}
      {selectionType === 'Genre' && (
        <div className="genre-selection">
          {genres.map((genre, index) => (
            <React.Fragment key={index}>
              <input
                id={`genre-${index}`}
                type="checkbox"
                className="genre-checkbox"
                value={genre}
                onChange={handleGenreChange}
                checked={selectedGenres.includes(genre)}
              />
              <label
                htmlFor={`genre-${index}`}
                className={`genre-label ${selectedGenres.includes(genre) ? 'checked' : ''}`}
              >
                {genre}
              </label>
            </React.Fragment>
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

      {showLowLikesWarning && (
        <div className="custom-warning-overlay">
          <div className="custom-warning-modal">
            <p>좋아요한 영화가 {likedMovies.length}개 입니다. 6개 이상의 영화 좋아요를 해주세요.</p>
          <button onClick={handleCloseWarning} className='custom-warning-button'>확인</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MovieForm;
