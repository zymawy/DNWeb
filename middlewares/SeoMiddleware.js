const GeneralSetting = require('../models/generalSetting')

/**
 * The function ShareGeneralSettings retrieves general settings and assigns them to the res.locals object.
 * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request, such
 * as the request headers, query parameters, and request body. It is used to retrieve data from the client and pass it to
 * the server.
 * @param res - The `res` parameter is the response object in Express.js. It represents the HTTP response that will be sent
 * back to the client.
 * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware function
 * in the request-response cycle. It is typically used to move to the next middleware function after the current middleware
 * function has completed its tasks.
 */
const ShareGeneralSettings = async (req, res, next) => {

    const settings = await (new GeneralSetting()).findBy({});

    if (Array.isArray(settings) && settings.length) {
        settings.forEach((setting) => {
            res.locals['platform' + res.locals.helpers.capitalizeString(setting?.attributes?.key)] = setting?.attributes?.value || null;
        })
    }

    next();
}

module.exports = {ShareGeneralSettings}