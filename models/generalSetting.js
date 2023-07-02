const Model = require('./baseModel')
class GeneralSetting extends Model {
    constructor() {
        super('general_settings');
    }
}

module.exports = new GeneralSetting()