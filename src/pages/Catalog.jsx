import React from 'react';
import { useParams } from 'react-router';

import PageHeader from '../components/page-header/PageHeader';
import MovieGrid from '../components/movie-grid/MovieGrid';
import { category as categoryApi } from '../api/tmdbApi';

const Catalog = () => {
    const { category } = useParams();

    // 카테고리명 결정
    const categoryTitle = category === categoryApi.movie ? 'Movies' : 'TV Series';

    return (
        <>
            <PageHeader>{categoryTitle}</PageHeader>
            <div className="container">
                <div className="section mb-3">
                    <MovieGrid category={category} />
                </div>
            </div>
        </>
    );
}

export default Catalog;
