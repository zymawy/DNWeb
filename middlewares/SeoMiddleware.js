const GeneralSetting = require('../models/generalSetting')
const { capitalizeString } = require('../helpers/capitalize');
const ShareGeneralSettings = async (req, res, next) => {

    // const settings = await GeneralSetting.findAll();
    // //
    // if (Array.isArray(settings) && settings.length) {
    //     settings.forEach((setting) => {
    //         // res.locals['platform' + res.locals.helpers.capitalizeString(setting.key)] = setting.value || null;
    //     })
    // }

    next();
}

module.exports = { ShareGeneralSettings }