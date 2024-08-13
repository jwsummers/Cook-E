import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { AuthProvider } from './context/AuthContext';

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <AuthProvider>
                <App />
            </AuthProvider>
        </React.StrictMode>
    );
} else {
    console.error('Failed to find the root element');
}
