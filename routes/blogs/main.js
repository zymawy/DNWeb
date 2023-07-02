const express = require('express');
const blogController = require('../../controllers/blogController');
const categoryController = require('../../controllers/categoryController');
const ReplyController = require('../../controllers/replyController');
const router = express.Router();

router.get('/', blogController.index);
router.post('/', blogController.store);
router.get('/categories/:category', categoryController.show);
router.get('/query', blogController.query);
router.get('/create', blogController.index);
router.get('/:id/edit', blogController.edit);
router.get('/:id', blogController.show);
router.put('/:id', blogController.show);
router.delete('/:id', blogController.show);
router.post('/:id/comments', ReplyController.post);


module.exports = router;