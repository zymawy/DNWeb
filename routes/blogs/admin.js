const express = require('express');
const blogController = require('../../controllers/admin/blogController');
const replyController = require('../../controllers/admin/replyController');
const userController = require('../../controllers/admin/userController');
const multer = require('multer');
const router = express.Router();
const path = require("path");
const {body} = require("express-validator");

/**
 * The function checks if a file has a valid image extension and mimetype, and returns an error message if it doesn't.
 * @param file - The `file` parameter represents the file that needs to be checked for its file type.
 * @param cb - The parameter "cb" stands for "callback function". It is a function that is passed as an argument to the
 * "checkFileType" function. The purpose of the callback function is to handle the result of the file type check.
 * @returns either `null` and `true` if the file's mimetype and extension name match the allowed file types, or an error
 * message if they do not match.
 * @see https://www.makeuseof.com/upload-image-in-nodejs-using-multer/
 */
const checkFileType = function (file, cb) {

    const fileTypes = /jpeg|jpg|png|gif|svg/;

    //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb("Error: You can Only Upload Images!!");
    }
};

/* creating a configuration object for multer's disk storage engine. This configuration
specifies where the uploaded files should be stored and how their filenames should be generated. */
const storageEngine = multer.diskStorage({
    destination: "./public/uploads", filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);

        // cb(null, `${Date.now()}${extension}`);
        cb(null, `${file.fieldname}-${Date.now()}${extension}`);
    },
});

/* creating an instance of the multer middleware with specific configurations. */
const upload = multer({
    storage: storageEngine, dest: 'uploads/', limits: {
        fileSize: 1000000 //1MB
    }, fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },

});

/* defining a GET route for the root URL ("/") of the application. When a GET
request is made to the root URL, the `blogController.index` function will be executed. This route is typically used to
display a list of blog posts or the homepage of the application. */
router.get('/', blogController.index);

/* defining a POST route for the specified URL pattern ("/:id?") and attaching multiple middleware functions to
it should accept as body requests.
     - image FILE, Optional
     - title TEXT, Required
     - subtitle TEXT, Required
     - status TEXT, Required
     - categories ARRAY, Required
     - tags ARRAY, Required
  and params
     - id TEXT/NUMBER, Required
it. */
router.post('/:id?', upload.single('image'), body('title').notEmpty().escape().trim().withMessage('Title Cannot Be Empty'), body('subtitle').notEmpty().escape().trim().withMessage('Subtitle Cannot Be Empty'), body('status').notEmpty().escape().trim(), body('desc').notEmpty().escape().trim(), body('categories').optional().isArray(), body('tags').optional().isArray(), blogController.store);

/* defining a GET route for the URL pattern "/create". When a GET
request is made to this URL, the `blogController.create` function will be executed. This route is typically used to
display a form or page for creating a new blog post. */
router.get('/create', blogController.create);

/* `router.get('/:id/edit', blogController.edit);` is defining a GET route for the URL pattern "/:id/edit". This route is
used to handle requests for editing a specific blog post. The `blogController.edit` function will be executed when a GET
request is made to this URL. */
router.get('/:id/edit', blogController.edit);

/* defining a DELETE route for the URL pattern `/:id`. This
route is used to handle requests for deleting a specific blog post. When a DELETE request is made to this URL, the
`blogController.delete` function will be executed.
it accepts params
     - id TEXT/NUMBER, Required
*/
router.delete('/:id', blogController.delete);

/* defining a PUT route for the URL pattern
`/:id/approve`. This route is used to handle requests for approving a specific blog post. When a PUT request is made to
this URL, the `blogController.approve` function will be executed.
it accepts params
     - id TEXT/NUMBER, Required
  */
router.put('/:id/approve', blogController.approve);

// comments

/* defining a GET route for the URL pattern "/comments". When a GET
request is made to this URL, the `replyController.index` function will be executed. This route is typically used to
display a list of comments or handle requests related to comment. */
router.get('/comments', replyController.index)

/* defining a PUT route for the URL pattern
`/comments/:comment`. This route is used to handle requests for approving a specific comment. When a PUT request is made
to this URL, the `replyController.approve` function will be executed. The `:comment` parameter in the URL represents the
ID or identifier of the comment that needs to be approved.
it accepts params
     - comment TEXT/NUMBER, Required
 */
router.put('/comments/:comment', replyController.approve)

// users
/* defining a GET route for the URL pattern "/users". When a GET request is
made to this URL, the `userController.index` function will be executed. This route is typically used to display a list
of users or handle requests related to users. */
router.get('/users', userController.index)


module.exports = router;