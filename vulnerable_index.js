const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

// Setup simple in-memory SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
    // Weak password storage - storing plain text
    db.run("INSERT INTO users (username, password) VALUES ('admin', 'password123')");
    db.run("INSERT INTO users (username, password) VALUES ('user', 'qwerty')");
});

app.get('/', (req, res) => {
    res.render('index', { message: null, profileData: null });
});

// VULNERABLE LOGIN ROUTE (SQL Injection)
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // VULNERABLE QUERY: Concatenating strings makes it vulnerable to SQL injection
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    db.get(query, (err, row) => {
        if (err) {
            return res.status(500).send("Database error");
        }
        if (row) {
            res.render('index', { message: `Welcome, ${row.username}! You are logged in.`, profileData: null });
        } else {
            res.render('index', { message: "Invalid credentials.", profileData: null });
        }
    });
});

// VULNERABLE PROFILE ROUTE (Cross-Site Scripting - XSS)
app.get('/profile', (req, res) => {
    // VULNERABILITY: Directly rendering user input without sanitization
    const bio = req.query.bio || "No bio provided.";
    res.render('index', { message: null, profileData: bio });
});

app.listen(port, () => {
    console.log(`Vulnerable app listening at http://localhost:${port}`);
});
