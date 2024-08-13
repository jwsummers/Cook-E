import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
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

app.post('/recipes', authenticateToken, async (req, res) => {
    console.log("Received data:", req.body);

    const { name, ingredients, steps } = req.body;
    const userId = req.user.userId;

    if (!name || !ingredients || !steps || !userId) {
        return res.status(400).send("All recipe fields (name, ingredients, steps) and userId are required");
    }

    try {
        const ingredientsArray = Array.isArray(ingredients) ? ingredients : JSON.parse(ingredients); // Ensure it's an array
        const stepsArray = Array.isArray(steps) ? steps : JSON.parse(steps); // Ensure it's an array

        const result = await pool.query(
            'INSERT INTO recipes (name, ingredients, steps, user_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [name, ingredientsArray, stepsArray, userId]
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

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
