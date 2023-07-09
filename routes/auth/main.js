const express = require('express');
const LoginController = require('../../controllers/auth/Login');

const router = express.Router();
const {body} = require('express-validator');

router.get('/login', LoginController.login);
router.post('/login', body(['email', 'password']).notEmpty().escape().trim(), body(['email'])
    .isEmail()
    .withMessage('Not a valid e-mail address')
    .isLength({max: 100})
    .withMessage('Max length is 100 bytes'), LoginController.authenticate);
router.get('/register', LoginController.register);

router.post('/register', body('password').notEmpty().escape().trim(), body('email')
    .isEmail()
    .withMessage('Not a valid e-mail address')
    .isLength({max: 100})
    .withMessage('Max length is 100 bytes'), body('full_name')
    .isLength({min: 3})
    .withMessage('Min length is 3 charts'), LoginController.registration);


router.get('/logout', LoginController.logout)
module.exports = router;