import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserRecommendedMovies } from '../api/PostApiService';
import { useAuth } from './AuthContext';

const RecommendedMoviesContext = createContext();

export const useRecommendedMovies = () => useContext(RecommendedMoviesContext);

export const RecommendedMoviesProvider = ({ children }) => {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isRecommendLoading, setIsRecommendLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchRecommendedMovies = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsRecommendLoading(true);
    try {
      const response = await getUserRecommendedMovies();
      setRecommendedMovies(response.data);
      localStorage.setItem('recommendedMovies', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching recommended movies:', error);
    } finally {
      setIsRecommendLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const savedMovies = localStorage.getItem('recommendedMovies');
    const parsedMovies = savedMovies ? JSON.parse(savedMovies) : [];
    setRecommendedMovies(parsedMovies);
    fetchRecommendedMovies();
  }, [fetchRecommendedMovies]);

  return (
    <RecommendedMoviesContext.Provider value={{ recommendedMovies, isRecommendLoading, setRecommendedMovies, fetchRecommendedMovies }}>
      {children}
    </RecommendedMoviesContext.Provider>
  );
};

export default RecommendedMoviesProvider;
