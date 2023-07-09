const BaseModel = require('./baseModel')

/* The `PostTag` class is a subclass of `BaseModel` that represents a post category with additional tags and properties. */
class PostTag extends BaseModel {

    /**
     * The constructor function initializes an instance of the class 'post_categories' with specified tags and properties.
     * @param [tags] - The `tags` parameter is an object that contains additional information or metadata related to the
     * post categories. It is an optional parameter and its default value is an empty object `{}`.
     */
    constructor(tags = {}) {
        super('post_categories', tags, {
            category_id: null, post_id: null,
        });

        this.tagTable = 'pos'
    }

    // resetQuery() {
    //     // Generate columns for SELECT clause for the base model
    //     let baseModelColumns = Object.keys(this.attributes).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', ');
    //      baseModelColumns = Object.assign(baseModelColumns, Object.keys({post_id:null, tag_id: null}).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', '));
    //
    //     this.query = `SELECT ${baseModelColumns} FROM ${this.table} `;
    // }
}

module.exports = PostTag