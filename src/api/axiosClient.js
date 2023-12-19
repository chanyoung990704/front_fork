import axios from 'axios';
import queryString from 'query-string';
import apiConfig from './apiConfig';

// TMDB API에 대한 Axios 클라이언트 구성
const axiosClient = axios.create({
    baseURL: apiConfig.baseUrl,
    headers: {
        'Content-Type': 'application/json'
    },
    // 파라미터를 쿼리 문자열로 직렬화하고 API 키 추가
    paramsSerializer: params => queryString.stringify({...params, api_key: apiConfig.apiKey})
});

// 응답 인터셉터를 사용하여 응답 데이터 처리
axiosClient.interceptors.response.use((response) => {
    // 응답 데이터가 있을 경우 해당 데이터 반환
    return response && response.data ? response.data : response;
}, (error) => {
    // 에러 처리 로직 (여기에 로깅 또는 사용자 정의 오류 처리 추가 가능)
    throw error;
});

export default axiosClient;
