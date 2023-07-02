const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req, res, next) => {
    const token = req?.cookies?.jwt;

    if (token) {

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decodedToken) => {
            if (error) {
                res.redirect('/auth/login');
            } else {
                next();
            }
        });

    } else {

        res.redirect('/auth/login');
    }
}

const checkUser = (req, res, next) => {
    const token = req?.cookies?.jwt;


    if (token) {

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, decodedToken) => {


            if (error) {
                res.locals.currentUser = null;
                res.locals.isAdmin = false;
                res.locals.isLogedIn = false;
                next();
            }
            else {
                let user =  await (new User).findBy({'id': decodedToken.id});

                console.log(user)
                if (user.isLoaded()) {
                    res.locals.currentUser = user;
                    res.locals.isAdmin = Boolean(user.is_admin);
                    res.locals.isLogedIn = true;

                } else {
                    res.locals.currentUser = null;
                    res.locals.isAdmin = false;
                    res.locals.isLogedIn = false;
                }


                next();
            }
        });
    } else {
        res.locals.currentUser = null;
        res.locals.isAdmin = false;
        res.locals.isLogedIn = false;
        next();
    }
}

module.exports = { requireAuth, checkUser }