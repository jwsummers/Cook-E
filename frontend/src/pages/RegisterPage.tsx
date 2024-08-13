import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setUsername('');
                setPassword('');
                navigate('/login');
            } else {
                alert('Registration failed, please try again.');
            }
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Register</h2>
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
                    <button type="submit">Register</button>
                </form>
                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;