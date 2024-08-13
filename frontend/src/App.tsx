import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecipesPage from './pages/RecipesPage';
import AddRecipeForm from './components/AddRecipeForm';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token) {
            setIsLoggedIn(true);
            if (storedUsername) {
                setUsername(storedUsername);
            }
        }
    }, []);

    const handleLogin = (user: string, token: string) => {
        localStorage.setItem('username', user);
        localStorage.setItem('token', token);
        setUsername(user);
        setIsLoggedIn(true);
        console.log("User logged in:", user);
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        setUsername(null);
        setIsLoggedIn(false);
        console.log("User logged out");
    };

    return (
        <AuthProvider>
            <Router>
                <NavBar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/recipes" element={<RecipesPage />} />
                    <Route path="/add-recipe" element={<AddRecipeForm />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
