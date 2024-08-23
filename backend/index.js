import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from './middleware/authMiddleware.js';

dotenv.config();

const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(bodyParser.json());

// Initialize PostgreSQL client
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
});

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)', [username, hashedPassword]);
    res.status(201).send('User registered');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password_hash)) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        console.log("Login successful, token issued:", token);
        res.json({ token });
    } else {
        console.log("Login failed for user:", username);
        res.status(401).send('Invalid credentials');
    }
});

// Update the recipes POST route to handle image upload
app.post('/recipes', authenticateToken, upload.single('image'), async (req, res) => {
    const { name, ingredients, steps } = req.body;
    const userId = req.user.userId;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !ingredients || !steps || !userId) {
        return res.status(400).send("All recipe fields (name, ingredients, steps) and userId are required");
    }

    try {
        const ingredientsArray = JSON.parse(ingredients); // Ensure it's an array
        const stepsArray = JSON.parse(steps); // Ensure it's an array

        const result = await pool.query(
            'INSERT INTO recipes (name, ingredients, steps, user_id, image_url, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
            [name, ingredientsArray, stepsArray, userId, imageUrl]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error during recipe insertion:", error);
        res.status(500).send('Error adding recipe');
    }
});

app.get('/recipes', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            'SELECT * FROM recipes WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching recipes');
    }
});

// New DELETE route to delete a recipe
app.delete('/recipes/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    console.log(`Attempting to delete recipe with ID: ${id} for user: ${userId}`);

    try {
        const result = await pool.query(
            'DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rows.length === 0) {
            console.log('Recipe not found or user does not have permission');
            return res.status(404).send('Recipe not found or you do not have permission to delete it');
        }

        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).send('Error deleting recipe');
    }
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
