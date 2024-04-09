import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { OutlineButton } from '../components/button/Button';
import HeroSlide from '../components/hero-slide/HeroSlide';
import MovieList from '../components/movie-list/MovieList';
import RecommendMovieList from '../components/movie-list/RecommendMovieList';
import { useRecommendedMovies } from './RecommendedMovieContext';
import { useLikedMovies } from './LikedMoviesContext';
import { category, movieType } from '../api/tmdbApi';

const MOVIE_CATEGORY = 'movie';

const Home = () => {
    const { recommendedMovies, isRecommendLoading } = useRecommendedMovies();
    const { isAuthenticated } = useAuth();
    const { likedMovies, isLoading: isLikedMoviesLoading } = useLikedMovies();

    const renderMovieSection = (title, movies) => (
        movies && movies.length > 0 && (
            <div className="section mb-3">
                <div className="section__header mb-2">
                    <h2>{title}</h2>
                </div>
                <RecommendMovieList category={MOVIE_CATEGORY} id={movies} />
            </div>
        )
    );

    return (
        <>
            <HeroSlide />
            <div className="container">
                {isAuthenticated && !isLikedMoviesLoading && renderMovieSection('Ur Likes', likedMovies)}
                {isAuthenticated && !isRecommendLoading && renderMovieSection('Ur Recommendations', recommendedMovies)}
                <div className="section mb-3">
                    <SectionHeader title="Trending Movies" link="/movie" />
                    <MovieList category={category.movie} type={movieType.popular} />
                </div>
                <div className="section mb-3">
                    <SectionHeader title="Top Rated Movies" link="/movie" />
                    <MovieList category={category.movie} type={movieType.top_rated} />
                </div>
            </div>
        </>
    );
};

const SectionHeader = ({ title, link }) => (
    <div className="section__header mb-2">
        <h2>{title}</h2>
        <Link to={link}>
            <OutlineButton className="small">View more!!</OutlineButton>
        </Link>
    </div>
);

export default Home;
