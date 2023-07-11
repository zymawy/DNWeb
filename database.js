const sqlite3 = require('sqlite3').verbose();
const databaseName = process.env.DB_NAME;

const DB_SOURCE = ![undefined, null, ''].includes(databaseName) ? `./db/${databaseName}.db` : "./db/blogs.db"

/* This code is creating a new instance of the SQLite database and connecting to it. */
let db = new sqlite3.Database(DB_SOURCE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
    }
});

module.exports = db
