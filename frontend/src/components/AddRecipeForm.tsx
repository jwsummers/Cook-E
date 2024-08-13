import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AddRecipeForm.css';

const AddRecipeForm: React.FC = () => {
    const { isLoggedIn } = useAuth();  // Using useAuth to access isLoggedIn
    console.log("Is user logged in?", isLoggedIn);
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [ingredientInput, setIngredientInput] = useState('');
    const [steps, setSteps] = useState<string[]>([]);
    const [stepInput, setStepInput] = useState('');

    const handleAddIngredient = () => {
        setIngredients([...ingredients, ingredientInput]);
        setIngredientInput('');
    };

    const handleAddStep = () => {
        setSteps([...steps, stepInput]);
        setStepInput('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submission attempted");
        console.log("Recipe Name:", name);
    
        if (!isLoggedIn) {
            console.log("Submission blocked, user not logged in");
            alert("You must be logged in to add recipes.");
            return;
        }
    
        const recipeData = {
            name,
            ingredients,
            steps,
            userId: localStorage.getItem('userId'), // Ensure user ID is included
        };
    
        // Log the recipeData object
        console.log("Sending data:", recipeData);
    
        try {
            const response = await axios.post('http://localhost:3001/recipes', recipeData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Recipe added:', response.data);
    
            // Reset the form after successful submission
            setName('');
            setIngredients([]);
            setSteps([]);
        } catch (error) {
            console.error('Error adding recipe:', error);
            alert('Failed to add recipe, make sure you are logged in.');
        }
    };

    return (
        <div className="add-recipe-form">
            <h1>Add a New Recipe</h1>
            {isLoggedIn ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Recipe Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="ingredients">Ingredients</label>
                        <input
                            type="text"
                            id="ingredients"
                            value={ingredientInput}
                            onChange={(e) => setIngredientInput(e.target.value)}
                        />
                        <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
                        <ul>
                            {ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <label htmlFor="steps">Steps</label>
                        <input
                            type="text"
                            id="steps"
                            value={stepInput}
                            onChange={(e) => setStepInput(e.target.value)}
                        />
                        <button type="button" onClick={handleAddStep}>Add Step</button>
                        <ul>
                            {steps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ul>
                    </div>
                    <button type="submit">Add Recipe</button>
                </form>
            ) : (
                <p>Please log in to add recipes.</p>
            )}
        </div>
    );
};

export default AddRecipeForm;
