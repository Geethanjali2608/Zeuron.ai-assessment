const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const authenticateToken = require('./middleware');

const router = express.Router();
const secret = 'your_jwt_secret';

// User Signup
router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(username, hashedPassword, function(err) {
        if (err) {
            return res.status(400).send('User already exists');
        }
        res.status(201).send('User created');
    });
});

// User Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) {
            return res.status(400).send('User not found');
        }

        const validPass = bcrypt.compareSync(password, user.password);
        if (!validPass) {
            return res.status(400).send('Invalid password');
        }

        const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
        res.header('auth-token', token).send(token);
    });
});

// Add Recipe
router.post('/recipes', authenticateToken, (req, res) => {
    const { title, category, instructions, image_url } = req.body;
    const stmt = db.prepare('INSERT INTO recipes (user_id, title, category, instructions, image_url) VALUES (?, ?, ?, ?, ?)');
    stmt.run(req.user.id, title, category, instructions, image_url, function(err) {
        if (err) {
            return res.status(400).send('Error adding recipe');
        }
        res.status(201).send('Recipe added');
    });
});

// Get Recipes
router.get('/recipes', authenticateToken, (req, res) => {
    db.all('SELECT * FROM recipes WHERE user_id = ?', [req.user.id], (err, rows) => {
        if (err) {
            return res.status(400).send('Error fetching recipes');
        }
        res.json(rows);
    });
});

module.exports = router;
