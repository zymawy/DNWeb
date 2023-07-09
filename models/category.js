
const BaseModel = require('./baseModel')
const {strLimit} = require("../helpers/capitalize");

/* The Category class is a JavaScript class that represents a category object and includes methods for manipulating and
retrieving category data. */
class Category extends BaseModel{
    /**
     * The constructor function initializes an object with attributes and relations, including a "hasMany" relation for
     * post categories.
     * @returns The code is returning an object with a single property called "post_categories". The value of
     * "post_categories" is an object with two properties: "type" and "model". The "type" property is set to "hasMany" and
     * the "model" property is an object with several properties such as "attributes", "table", "join", and
     * "setAttributes".
     */
    constructor() {
        super('categories', {}, {
            'id': null,
            'name': null,
            'updated_at': null,
            'created_at': null
        });

        let that = this;
        this.relations = {
            get postCategory() {
                return {
                    type: 'hasMany',
                    model: {
                        attributes: {
                            'post_id': null,
                            'category_id': null
                        },
                        table: 'post_categories',
                        join: 'INNER',
                        setAttributes: function (data) {
                            // console.warn(data)
                            for (const key in this.attributes) {
                                if (data[key] !== undefined) {
                                    this.attributes[key] = data[key];
                                }
                            }
                            this.loaded = !!Object.keys(this.attributes).length;
                            delete this.table

                            that.post_categories.push(data);
                        }
                    }
                };
            },
        }

        this.pivotTable = 'post_categories';
        this.categoryAttributes = {post_id: null, category_id: null};

        that.post_categories = [];
    }

    /**
     * The function `getUrl()` returns a formatted URL string based on the attributes of the object.
     * @returns a URL string that includes the category ID and its corresponding slug.
     */
    getUrl() {

        return `/categories/${this.attributes.id}-${this.getSlug()}`
    }

    /**
     * The function `getTitle` returns a truncated version of the `name` attribute with a specified character limit and an
     * optional ending string.
     * @param [limit=100] - The limit parameter specifies the maximum number of characters that the title should be limited
     * to. If the title exceeds this limit, it will be truncated.
     * @param [end=...] - The "end" parameter is a string that will be appended to the end of the truncated string if it
     * exceeds the specified limit.
     * @returns the result of the strLimit function, which is a truncated version of the name attribute. The limit
     * parameter determines the maximum length of the truncated string, and the end parameter determines the characters to
     * append at the end of the truncated string.
     */
    getTitle(limit = 100, end = '...') {
        return strLimit(this.attributes.name, limit, end)
    }

    /**
     * The function returns an array of post categories, prioritizing a specific category if it exists.
     * @returns an array containing the values of `this.post_categories` and `this.post_categorie`.
     */
    getPostsCategories() {
        return [this.post_categories, this.post_categorie];
        if (this.post_categorie  && Array.isArray(this.post_categorie)) {
            return this.post_categorie;
        }

        return this.post_categories;
    }

    /**
     * The function sets the attributes of an object based on the provided data and updates the loaded status.
     * @param data - The `data` parameter is an object that contains the new attribute values that you want to set for the
     * current object.
     * @returns the object itself (this).
     */
    setAttributes(data) {
        for (const key in this.attributes) {
            // if (data[key] !== undefined) {
            this.attributes[key] = data[key];
            // }
        }
        this.loaded = !! Object.keys(this.attributes).length;

        this.relations = null;
        this.query = null;

        // console.log(this.relations)
        return this;
    }

    /**
     * The function `findBys` is a JavaScript function that constructs and executes a SQL query to retrieve data from a
     * database based on given parameters and optional relations.
     * @param params - An object containing the conditions for the query. Each key represents a field name and its
     * corresponding value represents the condition value.
     * @param [withRelations] - An optional array of relation names to include in the query.
     * @returns The function `findBys` is returning the result of the `promise` method with the specified query, bindings,
     * 'all', and withRelations parameters.
     */
    findBys(params, withRelations = []) {
        let conditions = Object.keys(params).map(field => `${this.pivotTable}.${field} = ?`).join(' AND ');

        let bindings = Object.values(params);

        const baseModelColumns = Object.keys(this.attributes).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', ');

        let query = `SELECT ${baseModelColumns}`;

        const relationColumns = Object.keys(this.categoryAttributes).map(attribute => {
            return `${this.pivotTable}.${attribute} as ${this.pivotTable}_${attribute}`
        }).join(', ');

        if (relationColumns) {
            query += `, ${relationColumns}`;
        }

        query = query.replace(/,$/, "");

        query += ` FROM ${this.table} JOIN ${this.pivotTable} on ${this.pivotTable}.category_id = ${this.table}.id `;

        query += ` WHERE ${conditions}`;

        return this.promise(query, bindings, 'all', withRelations);
    }
}

module.exports = Category