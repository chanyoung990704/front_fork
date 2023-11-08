import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './movie-list.scss';

import { SwiperSlide, Swiper } from 'swiper/react';

import TmdbApiForRecommendation from '../../api/axiosForRecommendation';
import MovieCard from '../movie-card/MovieCard';

const RecommendMovieList = props => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const getList = async () => {
          try {
            // props.id가 배열인 경우와 단일 ID인 경우 모두 처리할 수 있게 합니다.
            const ids = Array.isArray(props.id) ? props.id : [props.id];
            const responses = await TmdbApiForRecommendation.getMovie(ids);
            setItems(responses);
          } catch (error) {
            // 오류 처리 로직
            console.error("Could not fetch the movies:", error);
          }
        };
        getList();
      }, [props.id]);

    return (
        <div className="movie-list">
            <Swiper
                grabCursor={true}
                spaceBetween={10}
                slidesPerView={'auto'}
            >
                {
                    items.map((item, i) => (
                        <SwiperSlide key={i}>
                            <MovieCard item={item} category={props.category}/>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
}

RecommendMovieList.propTypes = {
    category: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
    ]).isRequired
  };

export default RecommendMovieList;
