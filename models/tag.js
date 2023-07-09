const BaseModel = require('./baseModel')

class Tag extends BaseModel {
    /**
     * This is a constructor function for a JavaScript class that represents a model for tags in a database, with a
     * relation to a pivot table called "post_tags".
     * @param [tags] - The `tags` parameter is an object that contains the initial values for the `id` and `name`
     * attributes of the `Tags` class. It is an optional parameter and if not provided, the `id` and `name` attributes will
     * be set to `null` by default.
     * @returns The constructor is returning an object with a single property called "postTags". The value of "postTags" is
     * an object with properties "type", "model", and "setAttributes".
     */
    constructor(tags = {}) {
        super('tags', tags, {
            id: null, name: null,
        });

        this.pivotTable = 'post_tags';
        this.tagAttributes = {post_id: null, tag_id: null};

        this.relations = {
            get postTags() {
                return {
                    type: 'hasMany', model: {
                        attributes: {
                            post_id: null, tag_id: null
                        }, table: 'post_tags', join: 'INNER', setAttributes: function (data) {
                            for (const key in this.attributes) {
                                if (data[key] !== undefined) {
                                    this.attributes[key] = data[key];
                                }
                            }
                            this.loaded = true;
                            delete this.table
                        }
                    }
                };
            },
        };
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

        const relationColumns = Object.keys(this.tagAttributes).map(attribute => {
            return `${this.pivotTable}.${attribute} as ${this.pivotTable}_${attribute}`
        }).join(', ');

        if (relationColumns) {
            query += `, ${relationColumns}`;
        }

        query = query.replace(/,$/, "");

        query += ` FROM ${this.table} JOIN ${this.pivotTable} on ${this.pivotTable}.tag_id = ${this.table}.id `;

        query += ` WHERE ${conditions}`;

        return this.promise(query, bindings, 'all', withRelations);
    }
}


module.exports = Tag