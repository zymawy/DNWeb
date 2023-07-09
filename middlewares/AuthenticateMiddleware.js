const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * The `requireAuth` function is a middleware that checks if a user is authenticated by verifying their JWT token, and
 * redirects them to the login page if the token is invalid or missing.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client. It contains
 * information about the request such as the request headers, request body, request method, request URL, and more.
 * @param res - The `res` parameter is the response object in Express.js. It is used to send a response back to the client.
 * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware function
 * in the request-response cycle. It is typically called at the end of the `requireAuth` middleware function to allow the
 * next middleware function to handle the request.
 * @returns In the first if statement, if there is an error in verifying the token, the function will return a redirect
 * response to '/auth/login'.
 */
const requireAuth = (req, res, next) => {
    const token = req?.cookies?.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decodedToken) => {
            if(error) res.redirect('/auth/login');
        });

        next();
    } else {
        if (['post', 'POST'].includes(req.method) && (req.header('want-json') ?? false)) {
            return res.status(401).send({ errors: [{"value": 'login', "msg": "Please Log In, To Comment", "path": "login"}]});
        }

        console.error(req.originalUrl, req?.originalUrl?.includes('auth'))
        if (! req?.originalUrl?.includes('auth') && ! res.locals.isLogedIn) {
            return res.status(401).redirect('/auth/login');
        }
        next();
    }
}

/**
 * The `checkUser` function checks if a user is logged in and sets the `currentUser`, `isAdmin`, and `isLogedIn` variables
 * in the response locals accordingly.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client. It contains
 * information such as the request headers, request body, request method, request URL, and more.
 * @param res - The `res` parameter is the response object in Express.js. It is used to send the response back to the
 * client.
 * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware function
 * in the request-response cycle. It is typically called at the end of the current middleware function to indicate that it
 * has completed its processing and the next middleware function should be called.
 */
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

/**
 * The function `validateAuth` checks if a user is logged in and redirects them to the appropriate page based on their
 * login status and role.
 * @param req - The `req` parameter represents the HTTP request object, which contains information about the incoming
 * request such as the request URL, headers, query parameters, and body.
 * @param res - The `res` parameter is the response object in Node.js. It represents the HTTP response that an Express.js
 * server sends back to the client. It contains methods and properties that allow you to manipulate the response, such as
 * setting headers, sending data, and redirecting the client to a different URL.
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware function in the
 * request-response cycle. It is typically called at the end of the current middleware function to indicate that it has
 * completed its processing and the next middleware function should be called.
 * @returns In this code snippet, the function `validateAuth` is being returned.
 */
const validateAuth = (req, res, next) => {

    if (! res.locals.isLogedIn) {
        next();
        return;
    }

    // in case it's logout, let's pass it...
        if (! req?.originalUrl?.includes('auth') && res.locals.isLogedIn && ! res.locals.isAdmin) {
            return res.redirect('/blogs');
        }

    next();
}

module.exports = { requireAuth, checkUser, validateAuth }