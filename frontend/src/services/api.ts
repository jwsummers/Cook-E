// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Adjust this URL for your backend

interface RecipeData {
    name: string;
    ingredients: string;
    steps: string;
    image_url: string;
    userId: string;
}

// Register a user
export const registerUser = async (username: string, password: string): Promise<void> => {
    await axios.post(`${API_BASE_URL}/register`, { username, password });
};

// Login a user
interface LoginResponse {
    token: string;
}

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, { username, password });
    return response.data; // This will contain the JWT token
};

// Add a recipe
export const addRecipe = async (recipeData: RecipeData): Promise<void> => {
    const token = localStorage.getItem('token');
    await axios.post(`${API_BASE_URL}/recipes`, recipeData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Get recipes
interface Recipe {
    id: string;
    name: string;
    ingredients: string;
    steps: string;
    image_url: string;
    userId: string;
}

export const getRecipes = async (): Promise<Recipe[]> => {
    const response = await axios.get<Recipe[]>(`${API_BASE_URL}/recipes`);
    return response.data;
};
