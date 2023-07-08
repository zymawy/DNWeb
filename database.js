const sqlite3 = require('sqlite3').verbose();
const DB_SOURCE = "./db/blogs.db"
const DUMMY_DATA = require('./db/seed/dummy_data.json');

let db = new sqlite3.Database(DB_SOURCE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    }else{
        console.log('Connected to the SQLite database.')
    }
});



// var dummy = JSON.parse(JSON.stringify(DUMMY_DATA));
//
// if (dummy) {
//     dummy.forEach((data) => {
//         db.run(`INSERT INTO posts (user_id, title, published_at, status, description, thumbnail, subtitle, created_at, read_time, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`, [1, data.title, data.publishedAt, 'published',
//             "Since Node JS environment is a bit flexible in its design, you could have very well built your own ORM (Object Relational Mapping) to your own preferred database. But it’s a hassle and takes huge amounts of time to make, basically it’s not practical. In software engineering we’re told time and time again to not re-invent the wheel so here a tutorial on how to use Sequelize on Node JS app, and doing all that in Heroku production at the bottom. First of all let’s lay the groundwork, we’re using Node JS app (I use Express specifically) web framework. Sequelize is a promise-based ORM for most databases like MySQL, Postgres, SQLite, MariaDB, and Microsoft SQL Server. And for the database that I use here is Postgres. We’ll follow these steps that me and my team used in our Software Development Project course project.",
//             data.image,
//             data.siteTwitter,
//             data.createdAt,
//             data.score, data.createdAt], function (err, res) {
//             console.log(err,res);
//         });
//     })
// }


module.exports = db
