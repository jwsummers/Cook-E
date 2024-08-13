import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    username: string | null;
    login: (username: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        setIsLoggedIn(!!token);
        if (storedUsername) setUsername(storedUsername);
    }, []);

    const login = (username: string, token: string) => {
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setUsername(username);
    };

    const logout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUsername(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
