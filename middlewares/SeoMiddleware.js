const GeneralSetting = require('../models/generalSetting')
const { capitalizeString } = require('../helpers/capitalize');
const ShareGeneralSettings = async (req, res, next) => {

    const settings = await (new GeneralSetting()).findBy({});
    //
    if (Array.isArray(settings) && settings.length) {
        settings.forEach((setting) => {
            res.locals['platform' + res.locals.helpers.capitalizeString(setting?.attributes?.key)] = setting?.attributes?.value || null;
        })
    }

    next();
}

module.exports = { ShareGeneralSettings }