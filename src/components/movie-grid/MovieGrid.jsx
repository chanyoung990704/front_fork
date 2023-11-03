import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';


import './movie-grid.scss';

import MovieCard from '../movie-card/MovieCard';
import Button, { OutlineButton } from '../button/Button';
import Input from '../input/Input'

import tmdbApi, { category, movieType, tvType } from '../../api/tmdbApi';
import { movieSearch } from '../../api/PostApiService';



function AutoComplete() {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();
  
    const autoComplete = async () => {
      if (inputValue.length >= 3) {
        try {
          const response = await movieSearch(inputValue)
          const data = response.data;
          setSuggestions(data);
        } catch (error) {
          console.error(error);
        }
      } else {
        setSuggestions([]);
      }
    };
  
    return (
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyUp={autoComplete}
          placeholder="검색어를 입력하세요..."
        />
        <ul>
            {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
                {/* 클릭 시 navigate 함수를 사용하여 페이지 이동 */}
                <a
                href={`/movie/${suggestion.tmdbId}`}
                onClick={(e) => {
                    e.preventDefault(); // 기본 링크 동작을 막습니다.
                    navigate(`/movie/${suggestion.tmdbId}`); // 페이지 이동
                }}
                >
                {suggestion.title}
                </a>
            </li>
            ))}
        </ul>
      </div>
    );
  }


const MovieGrid = props => {

    const [items, setItems] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    const { keyword } = useParams();

    useEffect(() => {
        const getList = async () => {
            let response = null;
            if (keyword === undefined) {
                const params = {};
                switch(props.category) {
                    case category.movie:
                        response = await tmdbApi.getMoviesList(movieType.upcoming, {params});
                        break;
                    default:
                        response = await tmdbApi.getTvList(tvType.popular, {params});
                }
            } else {
                const params = {
                    query: keyword
                }
                response = await tmdbApi.search(props.category, {params});
            }
            setItems(response.results);
            setTotalPage(response.total_pages);
        }
        getList();
    }, [props.category, keyword]);

    const loadMore = async () => {
        let response = null;
        if (keyword === undefined) {
            const params = {
                page: page + 1
            };
            switch(props.category) {
                case category.movie:
                    response = await tmdbApi.getMoviesList(movieType.upcoming, {params});
                    break;
                default:
                    response = await tmdbApi.getTvList(tvType.popular, {params});
            }
        } else {
            const params = {
                page: page + 1,
                query: keyword
            }
            response = await tmdbApi.search(props.category, {params});
        }
        setItems([...items, ...response.results]);
        setPage(page + 1);
    }

    return (
        <>
          <div className="section mb-3">
            <MovieSearch category={props.category} keyword={keyword} />
          </div>
          <div className="movie-grid">
            {items.map((item, i) => (
              <MovieCard category={props.category} item={item} key={i} />
            ))}
          </div>
          {page < totalPage ? (
            <div className="movie-grid__loadmore">
              <OutlineButton className="small" onClick={loadMore}>
                Load more
              </OutlineButton>
            </div>
          ) : null}
        </>
      );
}

const MovieSearch = props => {

    const history = useNavigate();

    const [keyword, setKeyword] = useState(props.keyword ? props.keyword : '');

    const goToSearch = useCallback(
        () => {
            if (keyword.trim().length > 0) {
                history.push(`/${category[props.category]}/search/${keyword}`);
            }
        },
        [keyword, props.category, history]
    );

    useEffect(() => {
        const enterEvent = (e) => {
            e.preventDefault();
            if (e.keyCode === 13) {
                goToSearch();
            }
        }
        document.addEventListener('keyup', enterEvent);
        return () => {
            document.removeEventListener('keyup', enterEvent);
        };
    }, [keyword, goToSearch]);

    return (
        <div className="movie-search">
          {/* AutoComplete 컴포넌트를 추가 */}
          <AutoComplete />

          <Button className="small" onClick={goToSearch}>
            Search
          </Button>
        </div>
      );
}

export default MovieGrid;
