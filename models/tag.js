const BaseModel = require('./baseModel')
class Tag extends BaseModel{

    constructor(tags = {}) {
        super('tags', tags, {
            id: null,
            name: null,
        });

        this.pivotTable = 'post_tags';
        this.tagAttributes = {post_id:null, tag_id: null};

        this.relations = {
            get postTags() {
                return {
                    type: 'hasMany',
                    model: {
                        attributes: {
                            post_id:null, tag_id: null
                        },
                        table: 'post_tags',
                        join: 'INNER',
                        setAttributes:  function (data) {
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

    findBys(params, withRelations = []) {
        let conditions = Object.keys(params).map(field => `${this.pivotTable}.${field} = ?`).join(' AND ');

        let bindings = Object.values(params);

        const baseModelColumns = Object.keys(this.attributes).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', ');

        let query = `SELECT ${baseModelColumns}`;

         const relationColumns = Object.keys(this.tagAttributes).map(attribute =>  {
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