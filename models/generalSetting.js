const Model = require('./baseModel')
class GeneralSetting extends Model {
    constructor() {
        super('general_settings', {}, {
            key: null,
            value: null,
            mate_data: null,
        });
    }

    getValue() {
        return this.attributes.value;
    }

    getKey() {
        return this.attributes.key;
    }

    getMateData() {

        return this.attributes.mate_data;
    }
}

module.exports = GeneralSetting