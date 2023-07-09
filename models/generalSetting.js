const Model = require('./baseModel')

/* The GeneralSetting class is a model that represents general settings with properties for key, value, and mate_data. */
class GeneralSetting extends Model {
    /**
     * The constructor function initializes an object with the properties 'key', 'value', and 'mate_data' for the
     * 'general_settings' class.
     */
    constructor() {
        super('general_settings', {}, {
            key: null, value: null, mate_data: null,
        });
    }

    /**
     * The getValue() function returns the value of the attributes property.
     * @returns The value of the "value" attribute.
     */
    getValue() {
        return this.attributes.value;
    }

    /**
     * The function `getKey()` returns the value of the `key` attribute.
     * @returns The value of the key attribute.
     */
    getKey() {
        return this.attributes.key;
    }

    /**
     * The function `getMateData()` returns the `mate_data` attribute.
     * @returns the value of the "mate_data" property of the "attributes" object.
     */
    getMateData() {
        return this.attributes.mate_data;
    }
}

module.exports = GeneralSetting