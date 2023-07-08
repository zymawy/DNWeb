const db = require('../database');
const {th, tr} = require("date-fns/locale");
const {dump, strLimit} = require("../helpers/capitalize");
const {getUnixTime, formatDistance, format, parseISO} = require("date-fns");
const fromUnixTime = require("date-fns/fromUnixTime");
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
        const baseModelColumns = Object.keys(this.attributes).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', ');

        this.query = `SELECT ${baseModelColumns} FROM ${this.table} `;
    }
    findAll(params = {}, columns = ['*'], options = 10) {

        let conditions = Object.keys(params).map(field => `${this.table}.${field} = ?`);

        if(options.onlyPublished) {
        conditions = conditions.concat(`${this.table}.published_at IS NOT NULL`);
        }

        conditions = conditions.join(' AND ');

        let bindings = Object.values(params);
        // const selectedColumns = columns.join(', ');

        if (conditions.length)
            this.query += ` WHERE ${conditions}`;


        if (typeof options == 'object') {

            if (options.order) {
                this.query += ` order by ${options.order} ${options.by || 'ASC'}`;
            }
            // limit last sql statement
            if (options.limit) {
                this.query += ` LIMIT ${options.limit}`;
            }

            if (options.offset) {
                this.query += ` OFFSET ${options.offset}`;
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

    findBy(params, withRelations = [], notNullParams = [], options = {}) {
        // let conditions = Object.keys(params).map(field => `${this.table}.${field} = ?`).join(' AND ');
        // let conditions = Object.keys(params).map(field => {
        //     return params[field] === null ? `${this.table}.${field} IS ?` : `${this.table}.${field} = ?`;
        // }).join(' AND ');

        let conditions = Object.keys(params).map(field => {
            return params[field] === null ? `${this.table}.${field} IS ?` : `${this.table}.${field} = ?`;
        });

        let notNullConditions = notNullParams.map(field => {
            return `${this.table}.${field} IS NOT NULL`;
        });

        let allConditions = conditions.concat(notNullConditions).join(' AND ');
        let bindings = Object.values(params);
        const baseModelColumns = Object.keys(this.attributes).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', ');
        let query = `SELECT ${baseModelColumns}`;
        const relationColumns = withRelations.map(relation => {
            if (!this.relations[relation]) {
                console.warn(`relation model "${relation}" does not exist.`);
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

        if (relationColumns) {
            query += `, ${relationColumns}`;
        }
        query = query.replace(/,$/, "");

        query += ` FROM ${this.table} `;


        if (withRelations.length > 0) {
            withRelations.forEach(relation => {
                if (!this.relations[relation]) return;

                const relationModel = this.relations[relation].model;
                const relationTable = relationModel.table;
                const relationJoin = relationModel.join;

                if (this.relations[relation].type === 'hasOne' || this.relations[relation].type === 'hasMany') {
                    let foreign = '';
                    if((this.table.charAt(this.table.length - 1) === 's' && ! ['categories'].includes(this.table))) {
                        foreign = this.table.slice(0, -1);
                    } else if (['categories'].includes(this.table)) {
                        foreign = 'category';
                    } else {
                        foreign = this.table;
                    }
                    const foreignKey = `${foreign}_id`;
                    query += `${relationJoin} JOIN ${relationTable} ON ${this.table}.id = ${relationTable}.${foreignKey} `;
                } else if (this.relations[relation].type === 'belongsTo') {
                    const foreignKey = `${relation}_id`;
                    query += `${relationJoin} JOIN ${relationTable} ON ${this.table}.${foreignKey} = ${relationTable}.id `;
                }
            });
        }


        if (allConditions)
            query += ` WHERE ${allConditions}`;

        if (options.order && options.by) {
            query += ` ORDER BY ${options.by} ${options.order}`;
        }
        return this.promise(query, bindings, 'all', withRelations);
    }

    search(query) {
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

    searchBy(params = {},  options = {type: 'category' }) {

        const baseModelColumns = Object.keys(this.attributes).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', ');

        this.query = `SELECT ${baseModelColumns} FROM ${this.table} `;

        if (options.type === 'tags') {
            this.query += ` LEFT JOIN 
        post_tags on post_tags.post_id = posts.id 
        LEFT JOIN tags on tags.id = post_tags.tag_id WHERE tags.id = ? `;
        } else if (options.type === 'category') {
            this.query += ` LEFT JOIN post_categories on post_categories.post_id = posts.id
        LEFT JOIN categories on categories.id = post_categories.category_id WHERE post_categories.category_id = ? AND posts.published_at IS NOT NULL`
        }
        // this.query += `WHERE posts_title LIKE ? OR posts_subtitle LIKE ? OR posts_description LIKE ? OR tags.name LIKE ? OR categories.name LIKE ? LIMIT 10`;

        return this.promise(this.query, Object.values(params));
    }


    create(data, options = {touchTimestamp: true}) {
        if (options.touchTimestamp) {
            data.created_at = getUnixTime(new Date())
            data.updated_at = getUnixTime(new Date())
        }

        const fields = Object.keys(data).join(', ');

        const placeholders = Object.keys(data).map(() => '?').join(', ');
        console.log('bindings')
        return this.promise(`INSERT INTO ${this.table} (${fields}) VALUES (${placeholders})`, Object.values(data), 'run');
    }

    update(params = {}, data, options = {touchTimestamp: true, updating: false}) {

        if (options.touchTimestamp) {
            if (! options.updating) {
                data.created_at = getUnixTime(new Date())
            }
            data.updated_at = getUnixTime(new Date())
        }

        const placeholders = Object.keys(data).map((key) => `${key} = ?`).join(', ');

        let conditions = Object.keys(params).map(field => {
            return params[field] === null ? `${this.table}.${field} IS ?` : `${this.table}.${field} = ?`;
        });

        let allConditions = conditions.join(' AND ');
        let bindings = Object.values({...data, ...params});

        return this.promise(`UPDATE ${this.table} SET ${placeholders} WHERE ${allConditions}`, bindings, 'run');
    }

    delete(params = {}) {

        let conditions = Object.keys(params).map(field => {
            return params[field] === null ? `${this.table}.${field} IS ?` : `${this.table}.${field} = ?`;
        });

        let allConditions = conditions.join(' AND ');
        let bindings = Object.values(params);

        return this.promise(`DELETE FROM ${this.table} WHERE ${allConditions}`, bindings, 'run');
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
        // console.log(query, binding)
        const self = this;
        return new Promise((resolve, reject) => {
            this.db[method](query, binding, function(err, result) {
                if (err) reject(err);
                // console.log(result)
                const dbSelf = this
                const filterAttributes = (record, prefix) => {
                    // console.log('prefix', prefix)
                    const filtered = {};
                    for (const key in record) {
                        if (key.startsWith(prefix)) {
                            const newKey = key.replace(`${prefix}_`, '');
                            filtered[newKey] = record[key];
                        }
                    }
                    return filtered;
                };

                const createInstance = (modelInstance, attributes) => {
                    // console.warn(attributes)
                    modelInstance.setAttributes(attributes);
                    modelInstance.attributesRaw = attributes;
                    // console.log(modelInstance)
                    return modelInstance;
                };

                // Process the results
                if (Array.isArray(result) && result.length >= 1) {
                    const instances = result.map(record => {
                        const instance = createInstance(new self.constructor(), filterAttributes(record, self.table));
                        instance.rawData = record;
                        withRelations.forEach(relation => {
                            const relationModel = self.relations[relation].model;
                            // console.log(self.relations[relation])
                            if (self.relations[relation] === 'hasMany' || self.relations[relation].type === 'hasMany') {
                                if (['post_categories', 'categories'].includes(relation)) {
                                    relation = relation === 'post_categories' ? 'post_categorie' : 'categorie';
                                }
                                // console.log('relation', relation)
                                const relationInstances = result.map(record => createInstance(relationModel, filterAttributes(record, `${relation}s`)));
                                // console.log([relation, relationInstances]['attributes'])
                                if (['post_categorie', 'categorie'].includes(relation)) {
                                    relation = relation === 'post_categorie' ? 'post_categories' : 'categories';
                                }
                                // console.log(relation)
                                instance[relation] = relationInstances;
                            } else {
                                if (['post_categories', 'categories'].includes(relation)) {
                                    relation = relation === 'post_categories' ? 'post_categorie' : 'categorie';
                                }
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

    getUpdatedAt() {

        try {
            return formatDistance(this.validateDate(this?.attributes?.updated_at), new Date(), { addSuffix: true })
        } catch (e) {
            console.log(e)
        }
        return '';
    }

    getCreatedAt() {

        try {
            return formatDistance(this.validateDate(this?.attributes?.created_at), new Date(), { addSuffix: true })
        } catch (e) {

            console.log(e)
        }
        return '';
    }
    validateDate(date) {

        if(typeof date === 'string') {

            return parseISO(date)
        }

        return fromUnixTime(date)
    }


    getId() {
        return this.attributes.id;
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

    isPublished() {

        return Boolean(this?.attributes?.published_at);
    }

    isChild() {

        return Boolean(this?.attributes?.parent_id);
    }

    isParent() {
        return ! this.isChild();
    }
    getPublishedState() {
        return this.isPublished() ? 'Published' : 'UnPublished'
    }
    getPublishedAtForHumans() {

        const published = this.getPublished();
        if(! published) {
            return this.getPublishedState();
        }

        return format(published, 'Y-m-d H:i:s')
    }

    getPublishedAt() {

        const published = this.getPublished();
        if(! published) {
            return null;
        }

        return formatDistance(published, new Date(), { addSuffix: true })
    }

    getPublished() {
        const published = this?.attributes?.published_at;

        if(! published) {
            return null;
        }


        if(typeof published === 'string') {

            return parseISO(published)
        }

        return fromUnixTime(published)
    }
}

module.exports = BaseModel;