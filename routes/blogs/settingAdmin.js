const express = require('express');
const settingController = require('../../controllers/admin/settingController');
const router = express.Router();
const {body} = require("express-validator");

const getMessage = (field) => {

    return `${field} Can't Be Empty`
}
router.get('/', settingController.index)
router.post('',
    body('title').notEmpty().escape().trim().withMessage(getMessage('Title')),
    body('keywords').notEmpty().escape().trim().withMessage(getMessage('Keywords')),
    body('author').notEmpty().escape().trim().withMessage(getMessage('Author')),
    body('subtitle').notEmpty().escape().trim().withMessage(getMessage('Subtitle')),
    settingController.store)


module.exports = router;