import { appClient } from "../pages/ApiClient";

// 사용자 등록 API 호출
export const register = (registerForm) => appClient.post('/api/members', registerForm);

// 카테고리(영화) 별 좋아요 API 호출
export const likes = (category, id) => appClient.post(`/api/${category}/${id}/likes`);

// 카테고리(영화) 별 좋아요 취소 API 호출
export const dislikes = (category, id) => appClient.delete(`/api/${category}/${id}/likes`);

// 영화 검색 API 호출
export const movieSearch = (keyword) => appClient.get(`/api/movies/search/autocomplete?prefix=${keyword}`);

// 사용자가 좋아한 영화 목록 가져오기
export const getUserLikedMovies = async () => appClient.get(`/api/members/likes/movies`);

// 영화 댓글 가져오기
export const getMovieComment = (id, page) => appClient.get(`/api/movie/${id}/comments?page=${page}&size=10`);

// 영화에 댓글 달기
export const postMovieComment = async (movieId, comment) => {
  try {
    const response = await appClient.post(`/api/movie/${movieId}/comments`, comment, {
      headers: { 'Content-Type': 'text/plain' }
    });
    return response.data;
  } catch (error) {
    // 에러 처리 로직
    console.error("댓글 달기 API 호출 중 오류 발생:", error);
    throw error;
  }
};

// 영화 추천하기
export const recommendMovie = (requestData) => appClient.post('/api/movie/recommendations', requestData);

// 사용자에게 추천된 영화 목록 가져오기
export const getUserRecommendedMovies = async () => appClient.get(`/api/members/recommendations/movies`);
