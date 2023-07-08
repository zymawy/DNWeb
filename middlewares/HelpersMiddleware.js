const GeneralSetting = require("../models/generalSetting");
const helpers = require("../helpers/capitalize");
var fromUnixTime = require('date-fns/fromUnixTime')

const HelpersMiddleware = async (req, res, next) => {

    res.locals.helpers = helpers;
    res.locals.helpers.fromUnixTime = fromUnixTime;
    res.locals.url = req.originalUrl;
    res.locals.host = req.get('host');
    res.locals.protocol = req.protocol;
    next();
}

module.exports = { HelpersMiddleware }