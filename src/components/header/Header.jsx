import React, { useRef, useEffect } from 'react';

import { Link, useLocation } from 'react-router-dom';

import './header.scss';
import { useAuth } from '../../pages/AuthContext';


const headerNav = [
    {
        display: 'Home',
        path: '/'
    },
    {
        display: 'Movies',
        path: '/movie'
    },
    {
        display: 'TV Series',
        path: '/tv'
    }

];

const Header = () => {

    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated


    const { pathname } = useLocation();
    const headerRef = useRef(null);

    const active = headerNav.findIndex(e => e.path === pathname);

    useEffect(() => {
        const shrinkHeader = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                headerRef.current.classList.add('shrink');
            } else {
                headerRef.current.classList.remove('shrink');
            }
        }
        window.addEventListener('scroll', shrinkHeader);
        return () => {
            window.removeEventListener('scroll', shrinkHeader);
        };
    }, []);

    return (
        <div ref={headerRef} className="header">
            <div className="header__wrap container">
                <div className="logo">
                    <Link to="/">UrMovies</Link>
                </div>
                <ul className="header__nav">
                    {headerNav.map((e, i) => (
                        <li key={i} className={`${i === active ? 'active' : ''}`}>
                            <Link to={e.path}>{e.display}</Link>
                        </li>
                    ))}
    
                    {/* 조건부 렌더링: 로그인 상태에 따라 다른 내비게이션 메뉴 표시 */}
                    <li className="nav-item fs-5">
                            {!isAuthenticated && <Link className="nav-link" to="/login">Login</Link>}
                    </li>

                    <li className="nav-item fs-5">
                            {isAuthenticated && <Link className="nav-link" to="/" onClick={authContext.logout}>Logout</Link>}
                    </li>

                </ul>
            </div>
        </div>
    );
}

export default Header;