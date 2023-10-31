import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import tmdbApi from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';

import './detail.scss';
import CastList from './CastList';
import VideoList from './VideoList';

import MovieList from '../../components/movie-list/MovieList';
import { likes, dislikes, getUserLikedMovies } from '../../api/PostApiService';
import { useAuth } from '../AuthContext';

const Detail = () => {

    const { category, id } = useParams();

    const [item, setItem] = useState(null);
    const [userLikedMovies, setUserLikedMovies] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');


    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated
    
    const fetchUserLikedMovies = async () => {
        if (isAuthenticated) {
            try {
                const userMovies = await getUserLikedMovies(); // Replace this with your API call to get user liked movies
                setUserLikedMovies(userMovies.data);
            } catch (error) {
                console.error('Error fetching user liked movies', error);
            }
        }
    };

    useEffect(() => {
        const getDetail = async () => {
            const response = await tmdbApi.detail(category, id, {params:{}});
            setItem(response);
            window.scrollTo(0,0);
        }
        getDetail();
    }, [category, id]);


    useEffect(() => {
        fetchUserLikedMovies();
    }, [isAuthenticated]);


    async function likeIt(id){
        try {
            const response = await likes(category, id)
            fetchUserLikedMovies();

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


    async function dislikeIt(id) {
        try {
            const response = await dislikes(category, id);
            fetchUserLikedMovies();
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
                                <div className="genres">
                                {isAuthenticated && (
                                    userLikedMovies.includes(item.id) ? (
                                        <button onClick={() => dislikeIt(item.id)} className="btn btn-danger">Dislike!</button>
                                    ) : (
                                        <button onClick={() => likeIt(item.id)}  className="btn btn-primary">LikeIt!</button>
                                    )
                                )}                                    {
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