import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

import { OutlineButton } from '../components/button/Button';
import HeroSlide from '../components/hero-slide/HeroSlide';
import MovieList from '../components/movie-list/MovieList';
import RecommendMovieList from '../components/movie-list/RecommendMovieList';
import { useRecommendedMovies } from './RecommendedMovieContext';
import { useLikedMovies } from './LikedMoviesContext';

// import { category, movieType, tvType } from '../api/tmdbApi';
import { category, movieType } from '../api/tmdbApi';

const Home = () => {
    const { recommendedMovies, isRecommendLoading } = useRecommendedMovies();
    const { isAuthenticated } = useAuth();
    const { likedMovies, isLoading: isLikedMoviesLoading } = useLikedMovies();

    return (
        <>
            <HeroSlide />
            <div className="container">

            {isAuthenticated && !isLikedMoviesLoading && (
                    likedMovies && likedMovies.length > 0 ? (
                        <div className="section mb-3">
                            <div className="section__header mb-2">
                                <h2>Ur Likes</h2>
                            </div>
                            <RecommendMovieList category='movie' id={likedMovies} />
                        </div>
                    ) : (
                        <div> </div>
                    )
                )}

                {isAuthenticated && !isRecommendLoading && (
                    recommendedMovies && recommendedMovies.length > 0 ? (
                        <div className="section mb-3">
                            <div className="section__header mb-2">
                                <h2>Ur Recommendations</h2>
                            </div>
                            <RecommendMovieList category='movie' id={recommendedMovies} />
                        </div>
                    ) : (
                        <div> </div>
                    )
                )}

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

                {/* <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Trending TV</h2>
                        <Link to="/tv">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    <MovieList category={category.tv} type={tvType.popular} />
                </div> */}

            </div>
        </>
    );
};

export default Home;
