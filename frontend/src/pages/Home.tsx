import React from 'react';
import HeroSection from '../components/HeroSection';
import AddRecipeForm from '../components/AddRecipeForm';

const Home: React.FC = () => {
    return (
        <div>
            <HeroSection />
            <div id="add-recipe-form-section">
                <AddRecipeForm />
            </div>
        </div>
    );
};

export default Home;
