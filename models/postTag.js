const BaseModel = require('./baseModel')

/* The `PostTag` class is a subclass of `BaseModel` that represents a post tag and initializes with the provided tags and
sets the `tagTable` property to 'tags'. */

class PostTag extends BaseModel {

    /**
     * The constructor function initializes an instance of the "post_tags" class with the provided tags and sets the
     * tagTable property to 'tags'.
     * @param [tags] - The `tags` parameter is an object that contains the data for the post tags. It is an optional
     * parameter and its default value is an empty object `{}`.
     */
    constructor(tags = {}) {
        super('post_tags', tags, {
            tag_id: null, post_id: null,
        });

        this.tagTable = 'tags'
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