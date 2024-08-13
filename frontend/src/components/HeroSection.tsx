import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    const scrollToForm = () => {
        const formSection = document.getElementById('add-recipe-form-section');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero-section">
            <div className="overlay">
                <div className="content">
                    <h1>Welcome to cook-E</h1>
                    <p>Your Online Recipe Book</p>
                    <div className="buttons">
                        <button onClick={() => navigate('/recipes')}>View Recipes</button>
                        <button onClick={scrollToForm}>Add New Recipe</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
