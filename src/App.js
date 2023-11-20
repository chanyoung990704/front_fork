import 'swiper/swiper.min.css';
import './assets/boxicons-2.0.7/css/boxicons.min.css';
import './App.scss';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/header/Header';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Detail from './pages/detail/Detail';
import LoginComponent from './pages/LoginComponent';
import SignupForm from './pages/Register';
import MovieForm from './pages/MovieRecommend';
import AuthProvider, { useAuth } from './pages/AuthContext';
import { LikedMoviesProvider } from './pages/LikedMoviesContext';
import RecommendedMoviesProvider from './pages/RecommendedMovieContext';

// AuthenticatedRoute 컴포넌트
function AuthenticatedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <LikedMoviesProvider>
                    <RecommendedMoviesProvider>
                        <Header />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/:category" element={<Catalog />} />
                            <Route path="/:category/search/:keyword" element={<Catalog />} />
                            <Route path="/:category/:id" element={<Detail />} />
                            <Route path="/login" element={<LoginComponent />} />
                            <Route path="/register" element={<SignupForm />} />
                            <Route 
                                path="/movieRecommend" 
                                element={
                                    <AuthenticatedRoute>
                                        <MovieForm />
                                    </AuthenticatedRoute>
                                } 
                            />
                        </Routes>
                    </RecommendedMoviesProvider>
                </LikedMoviesProvider>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
