import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

interface NavBarProps {
    isLoggedIn: boolean;
    username: string | null;
    onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ isLoggedIn, username, onLogout }) => {
    const navigate = useNavigate();

    const logoutHandler = () => {
        onLogout();
        navigate('/login'); // Redirects to the login page after logging out
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">cook-E</Link>
            </div>
            <div className="navbar-links">
                {isLoggedIn ? (
                    <div className="user-info">
                        <span>Logged in as {username}</span>
                        <button onClick={logoutHandler}>Logout</button>
                    </div>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
