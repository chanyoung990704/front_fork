import 'swiper/swiper.min.css';
import './assets/boxicons-2.0.7/css/boxicons.min.css';
import './App.scss';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Header from './components/header/Header';
import Footer from './components/footer/Footer';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Detail from './pages/detail/Detail';
import LoginComponent from './pages/LoginComponent';
import AuthProvider, { useAuth } from './pages/AuthContext';
import SignupForm from './pages/Register';
import MovieForm from './pages/MovieRecommend';



function AuthenticatedRoute({children}){

    const authContext = useAuth()
    if(authContext.isAuthenticated)
        return children


    return <Navigate to="/"></Navigate>

}



function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path='/:category/search/:keyword'
                        element={<>
                        <Header />
                        <Catalog />
                        <Footer />
                        </>}
                    />
                    <Route
                        path='/:category/:id'
                        element={<>
                        <Header />
                        <Detail />
                        </>}
                    />
                    <Route
                        path='/:category'
                        element={<>
                        <Header />
                        <Catalog />
                        <Footer />
                        </>}
                    />
                    <Route
                        path='/'
                        element={<>
                        <Header />
                        <Home />
                        <Footer />
                        </>}
                    />
                    <Route
                        path='/login'
                        element={<>
                        <Header />
                        <LoginComponent />
                        </>}
                    />

                    <Route
                        path='/register'
                        element={<>
                        <Header />
                        <SignupForm />
                        </>}
                    />  
                    
                    <Route
                        path='/movieRecommend'
                        element={<>
                        <Header />
                        <MovieForm />
                        </>}
                    />                  
                </Routes>
            </BrowserRouter>
      </AuthProvider>
    );
}

export default App;
