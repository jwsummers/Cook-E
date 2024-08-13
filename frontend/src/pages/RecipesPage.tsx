import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecipesPage.css';

interface Recipe {
    id: number;
    name: string;
    ingredients: string[];
    steps: string[];
    image_url: string;
}

const RecipesPage: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await axios.get('http://localhost:3001/recipes', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // assuming token is stored in localStorage
                },
            });
            setRecipes(response.data);
        };

        fetchRecipes();
    }, []);

    const [flipped, setFlipped] = useState<{ [key: number]: boolean }>({});

    const handleFlip = (id: number) => {
        setFlipped((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    };

    return (
        <div className="recipes-page">
            {recipes.map((recipe) => (
                <div key={recipe.id} className={`recipe-card ${flipped[recipe.id] ? 'flipped' : ''}`}>
                    <div className="recipe-card-inner">
                        <div className="recipe-card-front">
                            <img src={recipe.image_url} alt={recipe.name} />
                            <h3>{recipe.name}</h3>
                            <button onClick={() => handleFlip(recipe.id)}>See More</button>
                        </div>
                        <div className="recipe-card-back">
                            <h3>{recipe.name}</h3>
                            <h4>Ingredients:</h4>
                            <ul>
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                            <h4>Steps:</h4>
                            <ol>
                                {recipe.steps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                            <button onClick={() => handleFlip(recipe.id)}>Back</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecipesPage;
