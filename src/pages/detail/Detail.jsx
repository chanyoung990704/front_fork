import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import tmdbApi from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';

import './detail.scss';
import CastList from './CastList';
import VideoList from './VideoList';

import MovieList from '../../components/movie-list/MovieList';
import { likes } from '../../api/PostApiService';
import { useAuth } from '../AuthContext';

const Detail = () => {

    const { category, id } = useParams();

    const [item, setItem] = useState(null);

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated
    
    

    useEffect(() => {
        const getDetail = async () => {
            const response = await tmdbApi.detail(category, id, {params:{}});
            setItem(response);
            window.scrollTo(0,0);
        }
        getDetail();
    }, [category, id]);


    async function likeIt(id){
        try {
            const response = await likes(category, id)
            // 성공적인 응답 처리
            setSuccessMessage('좋아요 등록 완료!'); // 성공 메시지 설정

          } catch (error) {
            if (error.response) {
              // 서버 응답에서 에러 메시지 추출
              const errorData = error.response.data;
              setErrorMessage(errorData);
            } else {
              // 네트워크 에러 또는 다른 예외 처리
              setErrorMessage('서버와 통신 중 문제가 발생했습니다.');
            }
          }
    }

    return (
        <>
            {
                item && (
                    <>
                        <div className="banner" style={{backgroundImage: `url(${apiConfig.originalImage(item.backdrop_path || item.poster_path)})`}}></div>
                        <div className="mb-3 movie-content container">
                            <div className="movie-content__poster">
                                <div className="movie-content__poster__img" style={{backgroundImage: `url(${apiConfig.originalImage(item.poster_path || item.backdrop_path)})`}}></div>
                            </div>
                            <div className="movie-content__info">
                                <h1 className="title">
                                    {item.title || item.name}
                                </h1>
                                {errorMessage && <div className='error-message'>{errorMessage}</div>}
                                {!errorMessage && successMessage && <div className="success-message">{successMessage}</div>}
                                <div className="genres">
                                    {isAuthenticated && <button onClick={() => likeIt(item.id)} className="btn btn-primary">LikeIt!</button>}
                                    {
                                        item.genres && item.genres.slice(0, 5).map((genre, i) => (
                                            <span key={i} className="genres__item">{genre.name}</span>
                                        ))
                                    }
                                </div>
                                <p className="overview">{item.overview}</p>
                                <div className="cast">
                                    <div className="section__header">
                                        <h2>Casts</h2>
                                    </div>
                                    <CastList id={item.id}/>
                                </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="section mb-3">
                                <VideoList id={item.id}/>
                            </div>
                            <div className="section mb-3">
                                <div className="section__header mb-2">
                                    <h2>Similar</h2>
                                </div>
                                <MovieList category={category} type="similar" id={item.id}/>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    );
}

export default Detail;