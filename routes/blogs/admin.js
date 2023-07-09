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
    //Allowed file extensions
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

/* The `storageEngine` variable is creating a configuration object for multer's disk storage engine. This configuration
specifies where the uploaded files should be stored and how their filenames should be generated. */
const storageEngine = multer.diskStorage({
    destination: "./public/uploads", filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);

        // cb(null, `${Date.now()}${extension}`);
        cb(null, `${file.fieldname}-${Date.now()}${extension}`);
    },
});

/* The code `const upload = multer({ ... })` is creating an instance of the multer middleware with specific configurations. */
const upload = multer({
    storage: storageEngine, dest: 'uploads/', limits: {
        fileSize: 1000000 //1MB
    }, fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },

});

router.get('/', blogController.index);
router.post('/:id?', upload.single('image'), body('title').notEmpty().escape().trim().withMessage('Title Cannot Be Empty'), body('subtitle').notEmpty().escape().trim().withMessage('Subtitle Cannot Be Empty'), body('status').notEmpty().escape().trim(), body('desc').notEmpty().escape().trim(), body('categories').optional().isArray(), body('tags').optional().isArray(), blogController.store);
router.get('/create', blogController.create);
router.get('/:id/edit', blogController.edit);
router.delete('/:id', blogController.delete);

// comments

router.get('/comments', replyController.index)
router.put('/comments/:comment', replyController.approve)

// users
router.get('/users', userController.index)


module.exports = router;