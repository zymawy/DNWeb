const express = require('express');
const tagController = require('../../controllers/admin/tagController');
const router = express.Router();
const {body} = require("express-validator");


/* defining a GET route for the root URL ("/") that will be handled by the
`tagController.index` function. When a GET request is made to the root URL, the `tagController.index` function will be
executed. */
router.get('/', tagController.index)

/* defining a POST route for the root URL ("/") that will be handled by the `tagController.store`
function. it should accept as body requests.
     - title TEXT, Required
*/
router.post('', body('title').notEmpty().escape().trim().withMessage('Title Cannot Be Empty'), tagController.store)

/* defining a GET route for the URL "/create" that will be handled by the
`tagController.create` function. When a GET request is made to the "/create" URL, the `tagController.create` function
will be executed. */
router.get('/create', tagController.create)
/* defining a GET route for the URL "/:id/edit" that will be handled by
the `tagController.edit` function. it should accept as params */
router.get('/:id/edit', tagController.edit)
router.delete('/:id', tagController.delete)
/* defining a PATCH(UPDATE) route for the root URL ("/") that will be handled by the `tagController.store`
function. it should accept as body requests.
     - title TEXT, Required
*/
router.patch('/:id', tagController.store)


module.exports = router;