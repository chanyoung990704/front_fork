import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserLikedMovies } from '../api/PostApiService';
import { useAuth } from './AuthContext';

const LikedMoviesContext = createContext();

export const useLikedMovies = () => useContext(LikedMoviesContext);

export const LikedMoviesProvider = ({ children }) => {
  const [likedMovies, setLikedMovies] = useState(() => {
    const saved = localStorage.getItem('likedMovies');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchUserLikedMovies = useCallback(async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const response = await getUserLikedMovies();
        setLikedMovies(response.data);
        localStorage.setItem('likedMovies', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching liked movies:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUserLikedMovies();
  }, [isAuthenticated, fetchUserLikedMovies]);

  return (
    <LikedMoviesContext.Provider value={{ likedMovies, isLoading, setLikedMovies }}>
      {children}
    </LikedMoviesContext.Provider>
  );
};

export default LikedMoviesProvider;
