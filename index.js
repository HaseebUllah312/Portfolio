const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet'); // 1. Imported Helmet
const bcrypt = require('bcrypt'); // 2. Imported Bcrypt
const jwt = require('jsonwebtoken'); // 3. Imported JWT
const validator = require('validator'); // 4. Imported Validator
const winston = require('winston'); // Week 3: Imported Winston

// Set up Basic Logging
const logger = winston.createLogger({ 
    transports: [
        new winston.transports.Console(), 
        new winston.transports.File({ filename: 'security.log' }) 
    ] 
});

const app = express();
const port = 3000;
const SECRET_KEY = 'your-secret-key-123'; // Secret for JWT

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

// 1. Secure Data Transmission: Add Helmet.js to secure HTTP headers
app.use(helmet()); 

// Setup simple in-memory SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(async () => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
    
    // 2. Password Hashing: Hash passwords before saving to database
    const adminHash = await bcrypt.hash('password123', 10);
    const userHash = await bcrypt.hash('qwerty', 10);
    
    db.run("INSERT INTO users (username, password) VALUES ('admin', ?)", [adminHash]);
    db.run("INSERT INTO users (username, password) VALUES ('user', ?)", [userHash]);
});

app.get('/', (req, res) => {
    res.render('index', { message: null, profileData: null });
});

// SECURED LOGIN ROUTE
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // 4. Sanitize and Validate Input: Check if username is alphanumeric
    if (!validator.isAlphanumeric(username)) {
         return res.render('index', { message: "Invalid username format.", profileData: null });
    }

    // FIX SQL INJECTION: Use Parameterized Queries (?) instead of concatenating strings
    const query = `SELECT * FROM users WHERE username = ?`;
    
    db.get(query, [username], async (err, row) => {
        if (err) return res.status(500).send("Database error");
        
        // 2. Password Hashing: Compare provided password with hashed password in DB
        if (row && await bcrypt.compare(password, row.password)) {
            // 3. Enhance Authentication: Issue JWT token upon successful login
            const token = jwt.sign({ id: row.id, username: row.username }, SECRET_KEY, { expiresIn: '1h' });
            
            logger.info(`Successful login for user: ${username}`);
            res.render('index', { 
                message: `Welcome, ${row.username}! You are logged in. Your JWT Token: ${token}`, 
                profileData: null 
            });
        } else {
            logger.warn(`Failed login attempt for user: ${username}`);
            res.render('index', { message: "Invalid credentials.", profileData: null });
        }
    });
});

// SECURED PROFILE ROUTE
app.get('/profile', (req, res) => {
    const bio = req.query.bio || "No bio provided.";
    
    // 4. Sanitize Input: Escape HTML characters to prevent XSS
    const sanitizedBio = validator.escape(bio);
    
    res.render('index', { message: null, profileData: sanitizedBio });
});

app.listen(port, () => {
    logger.info('Application started');
    console.log(`Secured app listening at http://localhost:${port}`);
});
