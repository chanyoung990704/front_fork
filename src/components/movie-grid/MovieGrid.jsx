import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './movie-grid.scss';
import MovieCard from '../movie-card/MovieCard';
import { OutlineButton } from '../button/Button';
import tmdbApi, { category, movieType, tvType } from '../../api/tmdbApi';
import { movieSearch } from '../../api/PostApiService';

function useClickOutside(handler) {
  const domNodeRef = useRef();

  useEffect(() => {
    let maybeHandler = (event) => {
      if (!domNodeRef.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener('mousedown', maybeHandler);

    return () => {
      document.removeEventListener('mousedown', maybeHandler);
    };
  });

  return domNodeRef;
}

function AutoComplete({ onSearchTermChange }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]); // 제안 목록 상태 추가
  const navigate = useNavigate();
  const domNode = useClickOutside(() => {
    setSuggestions([]); // Clear suggestions when clicking outside
  });

  // 자동완성 함수 수정
  const autoComplete = async (searchText) => {
    if (searchText.length >= 3) {
      try {
        const response = await movieSearch(searchText); // API 호출
        const data = response.data;
        setSuggestions(data); // 제안 목록 상태 업데이트
      } catch (error) {
        console.error(error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // 입력 값 변경 시 자동완성 함수 호출
  const onInputChange = (e) => {
    const newText = e.target.value;
    setInputValue(newText);
    autoComplete(newText); // 자동완성 함수 호출
    if (newText.length === 0) {
      onSearchTermChange(''); // 입력값이 없으면 검색어 상태도 초기화
    }
  };

  // 검색 버튼 클릭 시 검색어 상태 업데이트
  const handleSearch = () => {
    onSearchTermChange(inputValue);
  }

  return (
    <div className="autocomplete-container" ref={domNode}>
      <input
        type="text"
        value={inputValue}
        onChange={onInputChange}
        placeholder="검색어를 입력하세요..."
        className="autocomplete-input"
      />
      <button onClick={handleSearch} className="autocomplete-button">Search</button>
      {suggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} onClick={() => navigate(`/movie/${suggestion.tmdbId}`)}>
              {suggestion.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const MovieGrid = props => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const updateSearchTerm = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setPage(1);
  }

  useEffect(() => {
    const getList = async () => {
      let response = null;
      const params = { page: page };
      if (!searchTerm) {
        switch (props.category) {
          case category.movie:
            response = await tmdbApi.getMoviesList(movieType.upcoming, { params });
            break;
          default:
            response = await tmdbApi.getTvList(tvType.popular, { params });
        }
      } else {
        params.query = searchTerm;
        response = await tmdbApi.search(props.category, { params });
      }
      setItems([...(page > 1 ? items : []), ...response.results]);
      setTotalPage(response.total_pages);
    }
    getList();
  }, [props.category, searchTerm, page, items]);

  const loadMore = async () => {
    let response = null;
    const params = { page: page + 1 };
    if (!searchTerm) {
      switch (props.category) {
        case category.movie:
          response = await tmdbApi.getMoviesList(movieType.upcoming, { params });
          break;
        default:
          response = await tmdbApi.getTvList(tvType.popular, { params });
      }
    } else {
      params.query = searchTerm;
      response = await tmdbApi.search(props.category, { params });
    }
    setItems([...items, ...response.results]);
    setPage(page + 1);
  }

  return (
    <>
      <div className="movie-search">
        <AutoComplete onSearchTermChange={updateSearchTerm} />
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

export default MovieGrid;
