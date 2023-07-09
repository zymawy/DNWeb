const helpers = require("../helpers/capitalize");
var fromUnixTime = require('date-fns/fromUnixTime')

/**
 * The above function is a middleware in JavaScript that adds helper functions, URL information, and protocol information
 * to the response locals object.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client. It contains
 * information about the request such as the request method, request URL, request headers, request body, etc. In this case,
 * it is used to access the original URL of the request and the host and
 * @param res - The `res` parameter is the response object in Express.js. It represents the HTTP response that will be sent
 * back to the client. It is used to send data, set headers, and perform other operations related to the response.
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware function in the
 * chain. It is typically called at the end of the current middleware function to indicate that it has completed its
 * processing and the next middleware function should be called.
 */
const HelpersMiddleware = async (req, res, next) => {
    res.locals.helpers = helpers;
    res.locals.helpers.fromUnixTime = fromUnixTime;
    res.locals.url = req.originalUrl;
    res.locals.host = req.get('host');
    res.locals.protocol = req.protocol;
    res.locals.isActiveLink = (link) => {
        // console.log(link, req.originalUrl)
        return link == req.originalUrl
    }
    next();
}

module.exports = { HelpersMiddleware }