import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPage.css';

interface LoginPageProps {
    onLogin: (username: string, token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();  // Parse JSON from the response
            if (response.ok) {
                localStorage.setItem('token', data.token); // Store the JWT token in local storage
                console.log("JWT Token stored:", data.token);
                setUsername('');
                setPassword('');
                onLogin(username, data.token);  // Update the logged-in state
                navigate('/');  // Navigate to the home page after successful login
                console.log("Navigation to home after login.");
            } else {
                console.log("Login failed: ", data.message); // Log error message from server
                alert('Invalid credentials, please try again.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Login process encountered an error. Please try again later.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <p>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
