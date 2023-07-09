const User = require('../../models/user');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const hash = require("bcrypt");

const maxAge = 7 * 24 * 60 * 60;

/* The Login class handles user authentication, registration, and login/logout functionality, including password hashing
and JWT token generation. */
class Login {
    /**
     * The constructor function initializes the path and binds the login, authenticate, register, and registration methods
     * to the current object.
     */
    constructor() {
        this.path = 'auth/';
        this.login = this.login.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.register = this.register.bind(this);
        this.registration = this.registration.bind(this);
    }

    /**
     * The login function renders a login page with the title "Log In".
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * from the client. It includes details such as the request method, URL, headers, and body.
     * @param res - The "res" parameter is the response object that represents the HTTP response that will be sent back to
     * the client. It is used to send data, set headers, and end the response.
     * @param next - The "next" parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used to handle errors or to move on to the next middleware
     * function after the current one has completed its task.
     */
    login(req, res, next) {

        res.render(this.path + 'login', {title: 'Log In'});
    }

    /**
     * This function is used to authenticate a user by checking their email and password, and returning a JWT token if the
     * authentication is successful.
     * @param req - The `req` parameter is the request object that contains information about the incoming HTTP request,
     * such as the request headers, request body, and request parameters.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to set the response status, headers, and body. In this code snippet,
     * it is used to send the response back to the client with the appropriate status
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when you want to pass control to the next middleware
     * function after the current middleware function has completed its tasks.
     * @returns a response with status code 200 and a JSON object containing the user's ID and isAdmin status.
     */
    async authenticate(req, res, next) {
        const result = validationResult(req);

        /**
         * We have va;datpom error
         */
        if (result.isEmpty() === false) {
            return res.status(422).send({errors: result.array()});
        }

        const {email, password} = req.body;

        let alreadyInDatabase = await (new User).findBy({'email': email});

        if (alreadyInDatabase && !alreadyInDatabase.isLoaded()) {

            return res.status(422).send({
                errors: [{
                    "value": email, "msg": "User Not In Our Records ", "path": "email",
                }]
            });
        }

        try {
            let isSignedIn = await this.hashPassword(password, alreadyInDatabase?.attributes?.password, false);

            if (!isSignedIn) {
                throw new Error('Invalid Login!')
            }


            const token = await this.createToken(alreadyInDatabase?.attributes?.id);

            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})

        } catch (e) {

            return res.status(422).send({errors: [{"value": email, "msg": "Invalid Credential ", "path": "email",}]});
        }


        return res.status(200).json({
            user: {
                id: alreadyInDatabase?.attributes?.id, isAdmin: alreadyInDatabase?.attributes?.is_admin
            }
        });

    }

    /**
     * The register function renders a register page with the title "Register".
     * @param req - The req parameter is an object that represents the HTTP request made by the client. It contains
     * information such as the request method, request headers, request body, and request URL.
     * @param res - The `res` parameter is the response object that represents the HTTP response that will be sent back to
     * the client. It is used to send data back to the client, such as HTML, JSON, or other types of responses.
     * @param next - The "next" parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used to handle errors or to move on to the next middleware
     * function.
     */
    register(req, res, next) {

        res.render(this.path + 'register', {title: 'Register'});
    }

    /**
     * This function handles the registration process by validating the input, checking if the email already exists in the
     * database, hashing the password, creating a new user, generating a JWT token, setting the token as a cookie, and
     * returning the user ID.
     * @param req - The `req` parameter is the request object that contains information about the HTTP request made by the
     * client. It includes data such as the request headers, request body, request method, and request URL.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to control the response, such as setting the status code, sending
     * JSON data, setting cookies, etc.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     * @returns a response with the status code and JSON data. If there are validation errors, it will return a 422 status
     * code with an array of errors. If the registration is successful, it will return a 201 status code with the user ID
     * in the response body.
     */
    async registration(req, res, next) {

        const result = validationResult(req);

        /**
         * We have error
         */
        if (result.isEmpty() === false) {
            return res.status(422).send({errors: result.array()});
        }

        const {email, password, full_name} = req.body;

        let alreadyInDatabase = await (new User()).findBy({'email': email});


        // console.log(alreadyInDatabase)

        // in case
        if (alreadyInDatabase && alreadyInDatabase.isLoaded()) {

            return res.status(422).send({errors: [{"value": email, "msg": "Email already exits", "path": "email",}]});
        }

        let hashedPassword = await this.hashPassword(password)
        // all good ? let's create user
        let data = await (new User()).create({email, password: hashedPassword, full_name, is_admin: 0});

        console.log(data)
        const token = await this.createToken(data?.lastID);

        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})

        return res.status(201).json({user: data?.lastID})
    }

    /**
     * The function logs out the user by clearing the JWT cookie and redirecting them to the login page.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * from the client. It includes details such as the request method, URL, headers, and body.
     * @param res - The `res` parameter is the response object that represents the HTTP response that will be sent back to
     * the client. It is used to send the response back to the client, set cookies, redirect the client to a different URL,
     * etc.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when you want to perform some operations in the current
     * middleware function and then pass control to the next middleware function.
     * @returns a redirect response to the '/auth/login' route.
     */
    logout(req, res, next) {
        res.cookie('jwt', '', {maxAge: 1});

        console.log('Log Out')
        return res.redirect('/auth/login');
    }

    /**
     * The function `hashPassword` hashes a password using bcrypt if `encrypt` is true, or compares a password with a
     * hashed password if `encrypt` is false.
     * @param password - The `password` parameter is the plain text password that needs to be hashed or compared.
     * @param [comparePassword=null] - The `comparePassword` parameter is used when you want to compare a password with a
     * previously hashed password. It is optional and can be set to `null` if you don't need to compare passwords.
     * @param [encrypt=true] - The `encrypt` parameter is a boolean value that determines whether to encrypt the password
     * or compare it with another password. If `encrypt` is set to `true`, the function will encrypt the `password` using a
     * hashing algorithm. If `encrypt` is set to `false`, the function will compare
     * @returns the result of either hashing the password or comparing the password, depending on the value of the
     * `encrypt` parameter.
     */
    async hashPassword(password, comparePassword = null, encrypt = true) {
        if (encrypt) {
            return await hash.hash(password, await hash.genSalt());
        } else {
            return await hash.compare(password, comparePassword);
        }
    }

    /**
     * The function creates a JSON Web Token (JWT) with the given ID and a specified expiration time.
     * @param id - The `id` parameter is the unique identifier for the user or entity for which the token is being created.
     * It is used to associate the token with a specific user or entity.
     * @returns a JSON Web Token (JWT) that is generated using the provided id and the JWT_SECRET_KEY from the environment
     * variables. The token will expire after a certain amount of time specified by the maxAge variable.
     */
    async createToken(id) {

        return jwt.sign({id}, process.env.JWT_SECRET_KEY, {
            expiresIn: maxAge
        });
    }

}


module.exports = new Login();