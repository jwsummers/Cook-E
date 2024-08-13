// middleware/authMiddleware.js using ES Modules

import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("Received token:", token);

    if (!token) {
        console.log("No token found, unauthorized access attempted");
        return res.sendStatus(401); // Unauthorized if no token is found
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Token verification failed:", err);
            return res.sendStatus(403); // Forbidden if token is invalid
        }
        console.log("Token verified successfully, user:", user);
        req.user = user;
        next();
    });
};
