const BaseModel = require('./baseModel')
class PostTag extends BaseModel {

    constructor(tags = {}) {
        super('post_categories', tags, {
            category_id: null,
            post_id: null,
        });

        this.tagTable = 'pos'
    }

    resetQuery() {
        // Generate columns for SELECT clause for the base model
        let baseModelColumns = Object.keys(this.attributes).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', ');
         baseModelColumns = Object.assign(baseModelColumns, Object.keys({post_id:null, tag_id: null}).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', '));

        this.query = `SELECT ${baseModelColumns} FROM ${this.table} `;
    }
}
module.exports = PostTag