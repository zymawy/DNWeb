const db = require('../database');
const {th} = require("date-fns/locale");
const {dump} = require("../helpers/capitalize");
const {getUnixTime} = require("date-fns");
``
class BaseModel {

    constructor(table, data = {}, attributes = {}) {
        this.table = table;
        this.db = db;
        this.data = data;
        this.loaded = false;
        this.attributes = attributes;
        // Define the relations
        this.relations = {};
        this.hasData = false;

        this.resetQuery()
        this.withRelation = []
    }

    with(relation = []) {
        this.withRelation = relation
        return this;
    }

    resetQuery() {
        // Generate columns for SELECT clause for the base model
        const baseModelColumns = Object.keys(this.attributes).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', ');

        this.query = `SELECT ${baseModelColumns} FROM ${this.table} `;
    }
    findAll(params = {}, columns = ['*'], options = 10) {

        let conditions = Object.keys(params).map(field => `${this.table}.${field} = ?`).join(' AND ');
        let bindings = Object.values(params);
        // const selectedColumns = columns.join(', ');

        if (conditions.length)
            this.query += ` WHERE ${conditions}`;


        if (typeof options == 'object') {

            if (options.offset) {
                this.query += ` OFFSET ${options.offset}`;
            }

            if (options.order) {
                this.query += ` order by ${options.order} ${options.by || 'ASC'}`;
            }
            // limit last sql statement
            if (options.limit) {
                this.query += ` LIMIT ${options.limit}`;
            }
        } else {
            this.query += `LIMIT ${options}`;
        }

        return this.promise(this.query, [...bindings]);
    }

    inRandomOrder(limit = 5, columns = ['*']) {
        const selectedColumns = columns.join(', ');

        this.query += ` ORDER BY RANDOM() LIMIT ?`;

        return this.promise(this.query, [limit]);
    }

    findBy(params, withRelations = []) {
        let conditions = Object.keys(params).map(field => `${this.table}.${field} = ?`).join(' AND ');

        let bindings = Object.values(params);

        const baseModelColumns = Object.keys(this.attributes).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', ');

        let query = `SELECT ${baseModelColumns}`;

        // Generate columns for SELECT clause for each relation
        const relationColumns = withRelations.map(relation => {
            if (!this.relations[relation]) {
                console.warn(`The relation model "${relation}" does not exist.`);
                return;
            }

            const relationModel = this.relations[relation].model;
            const relationType = this.relations[relation].type;
            return Object.keys(relationModel.attributes).map(attribute =>  {
                let table = relation;
                if (relationType === 'hasMany') {
                    table = relation.charAt(relation.length - 1) === 's' ? relation.slice(0, -1) : this.table;
                }
                return `${table}s.${attribute} as ${table}s_${attribute}`
            }).join(', ');
        }).join(', ');

        // Include relation columns in SELECT clause if any relation is present
        if (relationColumns) {
            query += `, ${relationColumns}`;
        }
        query = query.replace(/,$/, "");

        query += ` FROM ${this.table} `;

        // Assumptions are made on the relationship between tables
        // Please adjust this as per your application's database design
        if (withRelations.length > 0) {
            withRelations.forEach(relation => {
                if (!this.relations[relation]) return;

                const relationModel = this.relations[relation].model;
                const relationTable = relationModel.table;
                const relationJoin = relationModel.join;

                if (this.relations[relation].type === 'hasOne' || this.relations[relation].type === 'hasMany') {
                    const foreign = this.table.charAt(this.table.length - 1) === 's' ? this.table.slice(0, -1) : this.table;
                    const foreignKey = `${foreign}_id`;
                    query += `${relationJoin} JOIN ${relationTable} ON ${this.table}.id = ${relationTable}.${foreignKey} `;
                } else if (this.relations[relation].type === 'belongsTo') {
                    const foreignKey = `${relation}_id`;
                    query += `${relationJoin} JOIN ${relationTable} ON ${this.table}.${foreignKey} = ${relationTable}.id `;
                }
            });
        }

        query += ` WHERE ${conditions}`;

        return this.promise(query, bindings, 'all', withRelations);
    }

    search(query) {
        // Generate columns for SELECT clause for the base model
        const baseModelColumns = Object.keys(this.attributes).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', ');

        this.query = `SELECT ${baseModelColumns} FROM ${this.table} `;

        this.query += ` LEFT JOIN 
        post_tags on post_tags.post_id = posts.id 
        LEFT JOIN tags on tags.id = post_tags.tag_id 
        LEFT JOIN post_categories on post_categories.post_id = posts.id
        LEFT JOIN categories on categories.id = post_categories.category_id
        WHERE posts_title LIKE ? OR posts_subtitle LIKE ? OR posts_description LIKE ? OR tags.name LIKE ? OR categories.name LIKE ? LIMIT 10`;

        return this.promise(this.query, [`%${query}%`, `%${query}%`, `%${query}%`,`%${query}%`,`%${query}%`])
    }


    create(data) {
        data.created_at = getUnixTime(new Date())
        data.updated_at = getUnixTime(new Date())

        const fields = Object.keys(data).join(', ');

        const placeholders = Object.keys(data).map(() => '?').join(', ');

        return this.promise(`INSERT INTO ${this.table} (${fields}) VALUES (${placeholders})`, Object.values(data), 'run');
    }


    get(limit = 10) {
        return this.promise(`SELECT * FROM ${this.table} limit ?`, [limit]);
    }

    all() {
        return this.findAll();
    }

    find(id) {
        return this.promise(`SELECT * FROM ${this.table} where id = ? order by id desc limit 1`, [id], 'get');
    }
    first() {
        return this.promise(`SELECT * FROM ${this.table} limit 1`,);
    }

    store (data) {

      return this.create(data);
    }

    promise(query, binding = [], method = 'all', withRelations = []) {
        const self = this;
        return new Promise((resolve, reject) => {
            this.db[method](query, binding, function(err, result) {
                if (err) reject(err);
                const dbSelf = this
                // Helper function to filter the attributes based on the prefix
                const filterAttributes = (record, prefix) => {
                    const filtered = {};
                    for (const key in record) {
                        if (key.startsWith(prefix)) {
                            const newKey = key.replace(`${prefix}_`, '');
                            filtered[newKey] = record[key];
                        }
                    }
                    return filtered;
                };

                // Helper function to create a model instance
                const createInstance = (modelInstance, attributes) => {
                    modelInstance.setAttributes(attributes);
                    return modelInstance;
                };

                // Process the results
                if (Array.isArray(result) && result.length >= 1) {
                    const instances = result.map(record => {
                        const instance = createInstance(new self.constructor(), filterAttributes(record, self.table));

                        withRelations.forEach(relation => {
                            const relationModel = self.relations[relation].model; // Assuming self[relation] is a model class
                            if (self.relations[relation] === 'hasMany') {
                                // Collect all the related records into an array
                                const relationInstances = result.map(record => createInstance(relationModel, filterAttributes(record, `${relation}s`)));
                                instance[relation] = relationInstances;
                            } else {
                                const relationInstance = createInstance(relationModel, filterAttributes(record, `${relation}s`));
                                instance[relation] = relationInstance;
                            }
                        });
                        // If this.lastID exists, it means we are dealing with a 'run' method
                        if (dbSelf.lastID) {
                            instance.lastID = dbSelf.lastID;
                            instance.changes = dbSelf.changes || null;
                        }

                        return instance;
                    });
                    this.hasData = true;

                    // dump(instances.length === 1 ? instances[0] : instances);
                    resolve(instances.length === 1 ? instances[0] : instances);
                }
                // If there are no results, resolve with null
                else {
                    this.hasData = false;
                    let instance = new self.constructor(self.table)
                    // If this.lastID exists, it means we are dealing with a 'run' method
                    if (dbSelf.lastID) {
                        instance.lastID = dbSelf.lastID;
                        instance.changes = dbSelf.changes || null;
                    }
                    resolve(instance);
                }
            });
        }).finally(async () => {

            this.resetQuery()

            // if (this.withRelation.length) {
            //
            //     Promise.all([this.withRelation.forEach(async (relation) => {
            //         switch (relation) {
            //             case 'comments':
            //         }
            //
            //     })]);
            // }
        });
    }



    setAttributes(data) {
        for (const key in this.attributes) {
            if (data[key] !== undefined) {
                this.attributes[key] = data[key];
            }
        }
        this.loaded = true;

        return this;
    }

    setExtraAttributes(key, value) {
        // console.log(value)
        this.attributes[key] = value;

        return this;
    }

    isLoaded() {
        return this.loaded;
    }

}

module.exports = BaseModel;