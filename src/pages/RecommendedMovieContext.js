import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserRecommendedMovies } from '../api/PostApiService';
import { useAuth } from './AuthContext';

const RecommendedMoviesContext = createContext();

export const useRecommendedMovies = () => useContext(RecommendedMoviesContext);

export const RecommendedMoviesProvider = ({ children }) => {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // 추천 영화 불러오는 로직을 별도의 함수로 분리
  const fetchRecommendedMovies = useCallback(async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const response = await getUserRecommendedMovies();
        setRecommendedMovies(response.data);
      } catch (error) {
        console.error('Error fetching recommended movies:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setRecommendedMovies([]);
    }
}, [isAuthenticated]); // isAuthenticated를 의존성 배열에 추가

useEffect(() => {
    fetchRecommendedMovies();
  }, [fetchRecommendedMovies]); // 의존성 배열에 fetchRecommendedMovies 추가

  return (
    <RecommendedMoviesContext.Provider value={{ recommendedMovies, isLoading, setRecommendedMovies, fetchRecommendedMovies }}>
      {children}
    </RecommendedMoviesContext.Provider>
  );
};

export default RecommendedMoviesProvider;
