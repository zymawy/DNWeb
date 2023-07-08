const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req, res, next) => {
    const token = req?.cookies?.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decodedToken) => {
            if (error) {
                return  res.redirect('/auth/login');
            }
        });
        next();
    } else {
        if (req.method === 'post' && (req.header('want-json') ?? false)) {
            return res.status(401).send({ errors: [{"value": 'login', "msg": "Please Log In, To Comment", "path": "login",}]});
        }
        next();
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

                if (user.isLoaded()) {
                    res.locals.currentUser = user;
                    res.locals.isAdmin = Boolean(user.getIsAdmin());
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

const validateAuth = (req, res, next) => {
    
    if (! res.locals.isLogedIn) {
        next();
        return;
    }

    // in case it's logout, let's pass it...
    if (! ['/auth/logout'].includes(req.originalUrl)) {
        if (res.locals.isLogedIn && res.locals.isAdmin) {
            return res.redirect('/admin');
        } else if (res.locals.isLogedIn) {
            return res.redirect('/blogs');
        }
    }

    next();
}

module.exports = { requireAuth, checkUser, validateAuth }