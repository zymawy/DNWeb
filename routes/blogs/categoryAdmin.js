const express = require('express');
const categoryController = require('../../controllers/admin/categoryController');
const router = express.Router();
const {body} = require("express-validator");


router.get('/', categoryController.index)
router.post('', body('title').notEmpty().escape().trim().withMessage('Title Cannot Be Empty'), categoryController.store)
router.get('/create', categoryController.create)
router.get('/:id/edit', categoryController.edit)
router.delete('/:id', categoryController.delete)
router.patch('/:id', categoryController.store)


module.exports = router;