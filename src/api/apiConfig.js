const apiConfig = {
    baseUrl: 'https://api.themoviedb.org/3/',
    apiKey: '14a77c40ff3440343792dec21646d0de',
    // 주어진 이미지 경로에 대한 전체 해상도 이미지 URL 생성
    originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
    // 주어진 이미지 경로에 대한 중간 해상도(w500) 이미지 URL 생성
    w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`
}

export default apiConfig;