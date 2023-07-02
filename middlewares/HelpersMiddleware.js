const GeneralSetting = require("../models/generalSetting");
const helpers = require("../helpers/capitalize");
const HelpersMiddleware = async (req, res, next) => {

    res.locals.helpers = helpers;

    next();
}

module.exports = { HelpersMiddleware }