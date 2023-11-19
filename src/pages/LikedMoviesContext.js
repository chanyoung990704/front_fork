// LikedMoviesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserLikedMovies } from '../api/PostApiService';
import { useAuth } from './AuthContext';

const LikedMoviesContext = createContext();

export const useLikedMovies = () => useContext(LikedMoviesContext);

export const LikedMoviesProvider = ({ children }) => {
  const [likedMovies, setLikedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchLikedMovies = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          const response = await getUserLikedMovies();
          setLikedMovies(response.data);
        } catch (error) {
          console.error('Error fetching liked movies:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setLikedMovies([]); // 사용자가 인증되지 않았을 경우
      }
    };

    fetchLikedMovies();
  }, [isAuthenticated]);

  return (
    <LikedMoviesContext.Provider value={{ likedMovies, isLoading, setLikedMovies }}>
      {children}
    </LikedMoviesContext.Provider>
  );
};

export default LikedMoviesProvider;
