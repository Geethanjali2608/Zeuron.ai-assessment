const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./recipes.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);
    
    db.run(`
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT,
            category TEXT,
            instructions TEXT,
            image_url TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);
});

module.exports = db;
