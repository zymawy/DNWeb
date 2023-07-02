
const BaseModel = require('./baseModel')
const {strLimit} = require("../helpers/capitalize");
class Category extends BaseModel{
    constructor() {
        super('categories', {}, {
            'id': null,
            'name': null,
            'updated_at': null,
            'created_at': null
        });
    }

    getSlug() {

        return (this.attributes.name || '')?.toLowerCase()?.replace(/[^a-z0-9]+/g, '-');
    }

    getUrl() {

        return `/categories/${this.attributes.id}-${this.getSlug()}`
    }

    getTitle(limit = 100, end = '...') {
        return strLimit(this.attributes.name, limit, end)
    }
}

module.exports = Category