const Category = require("../models/category");

/**
 * The CategoryMiddleware function retrieves all categories from the database and stores them in the response locals for
 * future use.
 * @param req - The `req` parameter is the request object that contains information about the incoming HTTP request, such
 * as the request headers, request parameters, and request body. It is used to access and manipulate the data sent by the
 * client to the server.
 * @param res - The `res` parameter is the response object in Express.js. It represents the HTTP response that is sent back
 * to the client. It is used to send data, set headers, and end the response. In this case, it is being used to attach the
 * `categories` data to the `res
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware function in the
 * request-response cycle. It is typically called at the end of the current middleware function to indicate that it has
 * completed its processing and the next middleware function should be called.
 */
const CategoryMiddleware = async (req, res, next) => {
    if (! res.locals.categories || (res.locals.categories && res.locals.categories.length === 0)) {
        const c = new Category();
        res.locals.categories = await c.findAll({}, ['*'], {order: 'sort', by: 'ASC'}); // limit: 6 can limit the categories
    }
    next();
}

module.exports = { CategoryMiddleware }