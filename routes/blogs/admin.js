const express = require('express');
const blogController = require('../../controllers/admin/blogController');

const router = express.Router();

router.get('/', blogController.index);
router.post('/', blogController.store);
router.get('/create', blogController.create);
router.get('/:id/edit', blogController.edit);
router.get('/:id', blogController.show);
router.put('/:id', blogController.show);
router.delete('/:id', blogController.show);


module.exports = router;