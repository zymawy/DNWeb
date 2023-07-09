const express = require('express');
const blogController = require('../../controllers/blogController');
const ReplyController = require('../../controllers/replyController');
const {requireAuth} = require("../../middlewares/AuthenticateMiddleware");
const {body} = require("express-validator");
const router = express.Router();

router.get('/', blogController.index);
router.get('/query', blogController.query);
router.get('/create', blogController.index);
router.get('/:id/edit', blogController.edit);
router.get('/:id', blogController.show);
router.put('/:id', blogController.show);
router.delete('/:id', blogController.show);
router.post('/:id/comments', body('comment').notEmpty().escape().isLength({min: 3}).withMessage("Comment Should Have More Then 3 Chart"),requireAuth, ReplyController.post);


module.exports = router;