const express = require('express');
const tagController = require('../../controllers/admin/tagController');
const router = express.Router();
const {body} = require("express-validator");


router.get('/', tagController.index)
router.post('', body('title').notEmpty().escape().trim().withMessage('Title Cannot Be Empty'), tagController.store)
router.get('/create', tagController.create)
router.get('/:id/edit', tagController.edit)
router.delete('/:id', tagController.delete)
router.patch('/:id', tagController.store)


module.exports = router;