//기존 tmdb API를 사용하는 로직을 사용할 때 오류가 발생하여 별도의 API 호출 코드 작성
import axios from 'axios';

const API_KEY = '14a77c40ff3440343792dec21646d0de'; // 여기에 실제 TMDB API 키를 입력하세요.

const TmdbApiForRecommendation = {
    getMovie: async (movieIds) => {
        const requests = movieIds.map((id) => 
          axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            params: { api_key: API_KEY }
          }).then(response => response.data)
        );
        return Promise.all(requests);
      },
  // ... 다른 API 함수들
};
export default TmdbApiForRecommendation;
