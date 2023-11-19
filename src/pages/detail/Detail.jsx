import React, { useEffect, useState, useCallback } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useParams } from 'react-router';

import tmdbApi from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';
import CastList from './CastList';
import VideoList from './VideoList';
import MovieList from '../../components/movie-list/MovieList';

import { likes, dislikes, getUserLikedMovies, getMovieComment, postMovieComment } from '../../api/PostApiService';
import { useAuth } from '../AuthContext';

import './detail.scss';

import { useLikedMovies } from '../LikedMoviesContext';

const Detail = () => {

    const { category, id } = useParams();

    const [item, setItem] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { likedMovies, setLikedMovies } = useLikedMovies();


    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated

    //사용자 좋아요 목록 가져오는 함수
    const fetchUserLikedMovies = useCallback(async () => {
        if (isAuthenticated) {
          try {
            const userMovies = await getUserLikedMovies();
            setLikedMovies(userMovies.data);
        } catch (error) {
            handleError(error); // 에러 처리를 위한 새로운 함수
          }
        }
      }, [isAuthenticated, setLikedMovies]);

      //좋아요 등록 함수
      const likeIt = useCallback(async (id) => {
        if (isAuthenticated) {
          try {
            await likes(category, id)
            fetchUserLikedMovies()
          } catch (error) {
            handleError(error); // 에러 처리를 위한 새로운 함수
          }
        }
      }, [isAuthenticated, category, fetchUserLikedMovies]);

      //좋아요 취소 함수
      const dislikeIt = useCallback(async (id) => {
        if (isAuthenticated) {
          try {
            await dislikes(category, id)
            fetchUserLikedMovies()
          } catch (error) {
            handleError(error); // 에러 처리를 위한 새로운 함수
          }
        }
      }, [isAuthenticated, category, fetchUserLikedMovies]);


    //댓글 작성 함수
    const fetchComments = async (movieId, page) => {
        try {
            const response = await getMovieComment(movieId, page);
            console.log(response);
            // 가정: response.data가 댓글 배열을 포함하는 객체일 경우
            if(response.data.comments){
                setComments(response.data.comments);
                setTotalPages(response.data.totalPages);
            }
            else
                setComments([])
        } catch (error) {
            console.error('댓글을 가져오는 중 오류가 발생했습니다:', error);
            setErrorMessage('댓글을 가져오는데 실패했습니다.');
        }
     };

      // 페이지 번호를 클릭했을 때 호출될 함수
    const handlePageClick = (event) => {
        const newPage = Number(event.target.id);
        setCurrentPage(newPage);
        fetchComments(id, newPage);
     };

    
    //작성한 댓글 서버에 등록하는 함수
    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return; // 빈 댓글을 방지합니다.
        try {
            // 서버로 새 댓글을 보내는 API를 호출합니다.
            await postMovieComment(id, newComment); // id는 현재 영화의 ID입니다.
            setNewComment(''); // 입력 필드 초기화합니다.
            fetchComments(id, totalPages - 1); // 댓글 목록을 새로고침합니다.
        } catch (error) {
            console.error('댓글을 등록하는데 실패했습니다.', error);
            setErrorMessage('댓글을 등록하는데 실패했습니다.');
        }
    };

    //에러 처리 함수
    const handleError = (error) => {
        if (error instanceof ReferenceError) {
          console.error("ReferenceError 발생:", error.message);
          // 참조 오류가 발생했을 때의 처리 로직
        } else if (error instanceof TypeError) {
          console.error("TypeError 발생:", error.message);
          // 타입 오류가 발생했을 때의 처리 로직
        } else {
          console.error("예상치 못한 오류 발생:", error.message);
          // 예상치 못한 다른 오류들을 처리하는 로직
        }
        // 여기서 추가적인 에러 처리 로직을 구현할 수 있습니다.
        // 예를 들어, 사용자에게 알림을 보내거나, 서버에 에러를 기록하는 등의 작업을 할 수 있습니다.
      };

    // UI 위한 배너
    const MovieBanner = ({ path }) => (
        <div className="banner" style={{ backgroundImage: `url(${apiConfig.originalImage(path)})` }}></div>
      );
      
    // UI 위한 영화 포스터
    const MoviePoster = ({ path }) => (
        <div className="movie-content__poster__img" style={{ backgroundImage: `url(${apiConfig.originalImage(path)})` }}></div>
      );
      
    // 영화 상세 정보
    const MovieInfo = React.memo(({ item, errorMessage, isAuthenticated, likedMovies, likeIt, dislikeIt }) => (
        <div className="movie-content__info">
            <h1 className="title">
                {item.title || item.name}
            </h1>
            {errorMessage && <div className='error-message'>{errorMessage}</div>}
            <div className="genres">
                {isAuthenticated && (
                likedMovies.includes(item.id) ? (
                    <button onClick={() => dislikeIt(item.id)} className="btn btn-danger">
                        <FaHeart style={{color : 'white'}}/>
                    </button>
                ) : (
                    <button onClick={() => likeIt(item.id)}  className="btn btn-primary">
                        <FaRegHeart />
                    </button>
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
      ));

    //페이지 번호 버튼을 생성합니다.
    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(
            <button
                key={i}
                id={i}
                className={`pagination__button ${currentPage === i ? 'active' : ''}`}
                onClick={handlePageClick}>
                {i + 1}
            </button>
        );
    }
    //tmdb에서 데이터 가져오기
    useEffect(() => {
        const getDetail = async () => {
            const response = await tmdbApi.detail(category, id, {params:{}});
            setItem(response);
            window.scrollTo(0,0);
        }
        getDetail();
    }, [category, id]);
    
    //사용자의 좋아요 목록 가져오기
    useEffect(() => {
        fetchUserLikedMovies();
    }, [isAuthenticated, fetchUserLikedMovies]);
    
    //게시글의 댓글 목록 가져오기
    useEffect(() => {
            fetchComments(id, 0); // 여기서 item.id를 인수로 전달
    }, [id]);
    
    
    return (
        <>
            {
                item && (
                    <>
                        <MovieBanner path={item.backdrop_path || item.poster_path} />
                        <div className="mb-3 movie-content container">
                            <div className="movie-content__poster">
                                <MoviePoster path={item.poster_path || item.backdrop_path} />
                            </div>
                            <div className="movie-content__info">
                                <MovieInfo 
                                    item={item}
                                    errorMessage={errorMessage}
                                    isAuthenticated={isAuthenticated}
                                    likedMovies={likedMovies}
                                    likeIt={likeIt}
                                    dislikeIt={dislikeIt}
                                />
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
                            <div>
                                <div className="section mb-3">
                                    <div className="section__header mb-2">
                                        <h2>Comment</h2>
                                    </div>
                                    <div className="comments__list">
                                        {comments.map((comment, index) => (
                                            <div key={index} className="comment-item">{comment}</div>
                                        ))}
                                    </div>
                                    <div className='pagination'>
                                        {pageNumbers}
                                    </div>
                                    {isAuthenticated && (
                                        <div className="comments__form">
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Add a comment..." // 플레이스홀더 추가
                                            />
                                            <button onClick={() => handleCommentSubmit()}>Submit</button>
                                            </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    );
}

export default React.memo(Detail);