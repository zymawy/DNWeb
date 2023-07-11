const express = require('express');
const blogController = require('../../controllers/blogController');
const ReplyController = require('../../controllers/replyController');
const {requireAuth} = require("../../middlewares/AuthenticateMiddleware");
const {body} = require("express-validator");
const router = express.Router();

/* defining a GET route for the root URL ("/") of the application. When a GET
request is made to the root URL, the `blogController.index` function will be executed. */
router.get('/', blogController.index);

/* defining a GET route for the "/query" URL of the application. When a
GET request is made to the "/query" URL, the `blogController.query` function will be executed.
it should accept
    query parameters `q`
*/
router.get('/query', blogController.query);


/* defining a GET route for the "/:id" URL of the application. When a
GET request is made to the "/:id" URL, the `blogController.query` function will be executed.
*/

router.get('/:id', blogController.show);

/* defining a GET route for the "/:id/edit" URL of the application. When
a GET request is made to the "/:id/edit" URL, the `blogController.edit` function will be executed. This route is
typically used to render a form or page for editing a specific blog post identified by the `id` parameter in the URL.
 it should accept as params
    - id TEXT
 */
router.get('/:id/edit', blogController.edit);

/*  defining a POST route for the "/:id/comments" URL of
the application. it should accept as body requests.
     - comment TEXT, Required, min: 3
  and params
     - id
 */
router.post('/:id/comments', body('comment').notEmpty().escape().isLength({min: 3}).withMessage("Comment Should Have More Then 3 Chart"),requireAuth, ReplyController.post);


module.exports = router;