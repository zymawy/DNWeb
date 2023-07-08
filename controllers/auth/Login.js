const User = require('../../models/user');
const { query, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const hash = require("bcrypt");

const  maxAge = 7 * 24 * 60 * 60;
const createToken = (id) => {

    return jwt.sign({id}, process.env.JWT_SECRET_KEY, {
        expiresIn: maxAge
    })
}

const  hashPassword = async (password, comparePassword = null, encrypt = true) => {
    if (encrypt) {
        return  await hash.hash(password, await hash.genSalt());
    } else {
        return  await hash.compare(password, comparePassword);
    }
}
class Login {

    constructor() {
        this.path = 'auth/';
        this.login = this.login.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.register = this.register.bind(this);
        this.registration = this.registration.bind(this);
    }

    login (req, res, next) {

        res.render(this.path + 'login', { title: 'Log In' });
    }
    async authenticate(req, res, next) {
        const result = validationResult(req);

        /**
         * We have va;datpom error
         */
        if (result.isEmpty() === false) {
            return res.status(422).send({ errors: result.array() });
        }
        //
        const {email, password} = req.body;

        let alreadyInDatabase = await (new User).findBy({'email': email});

        // in case
        if (alreadyInDatabase && ! alreadyInDatabase.isLoaded()) {

            return res.status(422).send({ errors: [{"value": email, "msg": "User Not In Our Records ", "path": "email",}]});
        }

        try {
            let isSignedIn = await hashPassword(password, alreadyInDatabase?.attributes?.password, false);

            if (! isSignedIn) {
                throw new Error('Invalid Login!')
            }


            const token = createToken(alreadyInDatabase?.attributes?.id);

            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

        } catch (e) {

            return res.status(422).send({ errors: [{"value": email, "msg": "Invalid Credential ", "path": "email",}]});
        }


        return res.status(200).json({user:{id: alreadyInDatabase?.attributes?.id, isAdmin: alreadyInDatabase?.attributes?.is_admin}});

    }
    register(req, res, next) {

        res.render(this.path + 'register', { title: 'Register' });
    }

    async registration(req, res, next) {
        const result = validationResult(req);

        /**
         * We have error
         */
        if (result.isEmpty() === false) {
            return res.status(422).send({ errors: result.array() });
        }

        const {email, password, full_name} = req.body;

      let alreadyInDatabase = await (new User()).findBy({'email': email});


        // console.log(alreadyInDatabase)

       // in case
        if (alreadyInDatabase && alreadyInDatabase.isLoaded()) {

            return res.status(422).send({ errors: [{"value": email, "msg": "Email already exits", "path": "email",}]});
        }

        let hashedPassword = await hashPassword(password)
        // all good ? let's create user
        let data = await (new User()).create({email, password: hashedPassword, full_name, is_admin: 0});

        const token = createToken(data?.lastID);

        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

        return res.status(201).json({user: data?.lastID})
    }

    logout(req, res, next) {
        res.cookie('jwt', '', {maxAge: 1 });

        console.log('Log Out')
        return res.redirect('/auth/login');
    }
}


module.exports = new Login();