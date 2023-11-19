import { appClient } from "../pages/ApiClient";


export const register = (registerForm) => appClient.post('/api/register', registerForm)
export const likes = (category, id) => appClient.post(`/api/${category}/like/${id}`)
export const dislikes = (category, id) => appClient.post(`/api/${category}/likecancel/${id}`)
export const movieSearch = (keyword) => appClient.get(`/autocomplete/search?prefix=${keyword}`)
export const getUserLikedMovies = async () => appClient.get(`/api/member/likemovie`)
export const getUserLikedMoviesToken = (token) => {
    return appClient.get(`/api/member/likemovie`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };
  
export const getMovieComment = (id, page) => appClient.get(`/api/movie/comment/${id}?page=${page}&size=10`)
export const postMovieComment = async (movieId, comment) => {
    const response = appClient.post(`/api/movie/comment/${movieId}`, comment, {
        headers: {
            'Content-Type': 'text/plain'
        },
    });
    return response.data;
};
export const recommendMovie = (requestData) => appClient.post('/api/movie/recommend', requestData)

export const getUserRecommendedMovies = async () => appClient.get(`/api/member/recommendedmovie`)
