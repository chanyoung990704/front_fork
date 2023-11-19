import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

import { OutlineButton } from '../components/button/Button';
import HeroSlide from '../components/hero-slide/HeroSlide';
import MovieList from '../components/movie-list/MovieList';
import RecommendMovieList from '../components/movie-list/RecommendMovieList';
import { useRecommendedMovies } from './RecommendedMovieContext';

import { category, movieType, tvType } from '../api/tmdbApi';

const Home = () => {
    const { recommendedMovies, isLoading } = useRecommendedMovies(); // 변경된 부분
    const { isAuthenticated } = useAuth(); // isAuthenticated 상태 가져오기

    return (
        <>
            <HeroSlide />
            <div className="container">
                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Trending Movies</h2>
                        <Link to="/movie">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    <MovieList category={category.movie} type={movieType.popular} />
                </div>

                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Top Rated Movies</h2>
                        <Link to="/movie">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    <MovieList category={category.movie} type={movieType.top_rated} />
                </div>

                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Trending TV</h2>
                        <Link to="/tv">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    <MovieList category={category.tv} type={tvType.popular} />
                </div>

                {isAuthenticated && ( // 로그인 상태일 때만 렌더링
                    <div className="section mb-3">
                        <div className="section__header mb-2">
                            <h2>Recommendation For You</h2>
                        </div>
                        {isLoading ? (
                            <div>Is Loading...</div>
                        ) : recommendedMovies && recommendedMovies.length > 0 ? (
                            <RecommendMovieList category='movie' id={recommendedMovies} />
                        ) : (
                            <div>No recommendations available</div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;
