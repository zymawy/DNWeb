const express = require('express');
const categoryController = require('../../controllers/admin/categoryController');
const router = express.Router();
const {body} = require("express-validator");

/* defining a GET route for the root URL ("/") that will be handled by the
`index` function in the `categoryController` module. */
router.get('/', categoryController.index)

/* defining a POST route for the root URL ("/") that will be handled by the `store` function
in the `categoryController` module.
it should accept as body requests.
     - title TEXT, Required
*/
router.post('', body('title').notEmpty().escape().trim().withMessage('Title Cannot Be Empty'), categoryController.store)
/* defining a GET route for the URL "/create" that will be handled by
the `create` function in the `categoryController` module. This route is used to render a form or page for creating a new
category. */
router.get('/create', categoryController.create)

/* `router.get('/:id/edit', categoryController.edit)` is defining a GET route for the URL "/:id/edit" that will be handled
by the `edit` function in the `categoryController` module. This route is used to render a form or page for editing a
specific category identified by the `id` parameter in the URL.
it accepts params
     - id TEXT/NUMBER, Required
 */
router.get('/:id/edit', categoryController.edit)

/* `router.delete('/:id', categoryController.delete)` is defining a DELETE route for the URL "/:id" that will be handled by
the `delete` function in the `categoryController` module. This route is used to delete a specific category identified by
the `id` parameter in the URL.
it accepts params
     - id TEXT/NUMBER, Required
  */
router.delete('/:id', categoryController.delete)

/* `router.patch('/:id', categoryController.store)` is defining a PATCH route for the URL "/:id" that will be handled by
the `store` function in the `categoryController` module. This route is used to update a specific category identified by
the `id` parameter in the URL. It accepts the `id` parameter as a path parameter and the request body should contain the
updated category data.
it accepts params
     - id TEXT/NUMBER, Required
 */
router.patch('/:id', categoryController.store)


module.exports = router;