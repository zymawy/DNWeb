const express = require('express');
const settingController = require('../../controllers/admin/settingController');
const router = express.Router();
const {body} = require("express-validator");

const getMessage = (field) => {

    return `${field} Can't Be Empty`
}
/* defining a GET route for the root URL ("/") of the application. When a GET
request is made to the root URL, the `index` function from the `settingController` module will be executed. */
router.get('/', settingController.index)

/* defining a POST route for the specified URL ("/"). When a POST request is made to this URL,
the request body will be validated using the `body` function from the `express-validator` module.
 it should accept as body requests.
     - title TEXT, Required
     - keywords TEXT, Required
     - subtitle TEXT, Required
     - author TEXT, Required
  and params
  */
router.post('', body('title').notEmpty().escape().trim().withMessage(getMessage('Title')), body('keywords').notEmpty().escape().trim().withMessage(getMessage('Keywords')), body('author').notEmpty().escape().trim().withMessage(getMessage('Author')), body('subtitle').notEmpty().escape().trim().withMessage(getMessage('Subtitle')), settingController.store)

/* defining a PUT route for the "/dummy" URL. When a PUT request is made
to this URL, the `dummy` function from the `settingController` module will be executed.
 */
router.put('/dummy', settingController.dummy)


module.exports = router;