const express = require("express");
require('dotenv').config()
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.APP_PORT;
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/uploads")));
global.db = require("./database.js")
const session = require('express-session')
const ejs = require("ejs");

app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: process.env.JWT_SECRET_KEY}))

app.use(bodyParser.urlencoded({ extended: true }));
require("./routes/main")(app);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.engine("html", ejs.renderFile);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));