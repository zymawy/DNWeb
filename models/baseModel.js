const db = require('../database');
const {strLimit} = require("../helpers/capitalize");
const {getUnixTime, formatDistance, format, parseISO} = require("date-fns");
const fromUnixTime = require("date-fns/fromUnixTime");

class BaseModel {

    /**
     * The constructor function initializes an object with properties for a table, data, attributes, relations, and query
     * parameters.
     * @param table - The table parameter is the name of the database table that the constructor is associated with.
     * @param [data] - The `data` parameter is an object that represents the initial data for the table. It is optional and
     * defaults to an empty object `{}`. This parameter allows you to pass in pre-existing data for the table when creating
     * an instance of the class.
     * @param [attributes] - The `attributes` parameter is an object that contains additional properties or settings for
     * the constructor. It is optional and can be used to customize the behavior of the constructor.
     */
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

    /**
     * The above function creates a JavaScript object with a property called "withRelation" that is initialized with an
     * empty array.
     * @param [relation] - The "relation" parameter is an array that represents a relationship between two or more
     * entities. It can be used to store information about how different entities are related to each other.
     * @returns The object itself with the updated "withRelation" property.
     */
    with(relation = []) {
        this.withRelation = relation
        return this;
    }

    /**
     * The function resets the query by constructing a SELECT statement with all the columns from the base model table.
     */
    resetQuery() {
        const baseModelColumns = Object.keys(this.attributes).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', ');

        this.query = `SELECT ${baseModelColumns}
                      FROM ${this.table} `;
    }

    /**
     * The function `findAll` takes in parameters, columns, and options, and generates a SQL query to retrieve data based
     * on the provided conditions and options.
     * @param [params] - An object containing key-value pairs representing the conditions to be applied in the SQL query.
     * The keys represent the field names and the values represent the values to be matched.
     * @param [columns] - An array of column names to be selected from the table. By default, it selects all columns ('*').
     * @param [options=10] - The `options` parameter is an object that can have the following properties:
     * @returns the result of the promise, which is the query and the bindings.
     */
    findAll(params = {}, columns = ['*'], options = 10) {

        let conditions = Object.keys(params).map(field => `${this.table}.${field} = ?`);

        if (options.onlyPublished) {
            conditions = conditions.concat(`${this.table}.published_at IS NOT NULL`);
        }

        conditions = conditions.join(' AND ');

        let bindings = Object.values(params);
        // const selectedColumns = columns.join(', ');

        if (conditions.length) this.query += ` WHERE ${conditions}`;


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

    /**
     * The function selects random rows from a database table and limits the number of results returned.
     * @param [limit=5] - The `limit` parameter specifies the maximum number of rows to be returned in the query result. In
     * this case, it is set to 5, meaning that the query will return a maximum of 5 rows.
     * @param [columns] - The "columns" parameter is an array that specifies the columns to be selected in the query. In
     * the code, it is joined using the `join()` method to create a comma-separated string of column names.
     * @returns a promise that executes a query with a random order and a specified limit. The query is constructed by
     * joining the selected columns with a comma and appending an "ORDER BY RANDOM() LIMIT ?" clause. The promise is
     * resolved with the query and the limit as parameters.
     */
    inRandomOrder(limit = 5, columns = ['*']) {
        const selectedColumns = columns.join(', ');

        this.query += ` ORDER BY RANDOM() LIMIT ?`;

        return this.promise(this.query, [limit]);
    }

    /**
     * The function `findBy` is a method that constructs and executes a SQL query to retrieve records from a database table
     * based on specified parameters, with optional relations and additional options.
     * @param params - An object containing the fields and values to search for in the database table.
     * @param [withRelations] - An array of strings representing the relations to include in the query. These relations
     * should be defined in the model's `relations` property.
     * @param [notNullParams] - The `notNullParams` parameter is an array that contains the names of the fields that should
     * not be null in the database query. These fields will be used to generate the conditions in the WHERE clause of the
     * query.
     * @param [options] - The `options` parameter is an object that can contain additional options for the query. It has
     * the following properties:
     * @returns the result of a database query.
     */
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
            return Object.keys(relationModel.attributes).map(attribute => {
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
                    if ((this.table.charAt(this.table.length - 1) === 's' && !['categories'].includes(this.table))) {
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


        if (allConditions) query += ` WHERE ${allConditions}`;

        if (options.order && options.by) {
            query += ` ORDER BY ${options.by} ${options.order}`;
        }
        return this.promise(query, bindings, 'all', withRelations);
    }

    /**
     * The search function performs a SQL query to search for posts, tags, and categories that match a given query.
     * @param query - The `query` parameter is a string that represents the search term or keyword that the user wants to
     * search for. It is used to search for matching records in the database based on various fields such as post title,
     * subtitle, description, tag name, and category name. The search is case-insensitive
     * @returns a promise that executes a SQL query.
     */
    search(query) {
        const baseModelColumns = Object.keys(this.attributes).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', ');

        this.query = `SELECT ${baseModelColumns}
                      FROM ${this.table} `;

        this.query += ` LEFT JOIN 
        post_tags on post_tags.post_id = posts.id 
        LEFT JOIN tags on tags.id = post_tags.tag_id 
        LEFT JOIN post_categories on post_categories.post_id = posts.id
        LEFT JOIN categories on categories.id = post_categories.category_id
        WHERE posts_title LIKE ? OR posts_subtitle LIKE ? OR posts_description LIKE ? OR tags.name LIKE ? OR categories.name LIKE ? LIMIT 10`;

        return this.promise(this.query, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`])
    }

    /**
     * The function `searchBy` performs a database query to search for posts based on specified parameters and options.
     * @param [params] - An object containing the parameters for the query. The keys of the object represent the column
     * names and the values represent the values to be searched for in those columns.
     * @param [options] - The `options` parameter is an object that can have a property called `type`. The default value
     * for `type` is `'category'`, but it can also be set to `'tags'`.
     * @returns the result of a database query.
     */
    searchBy(params = {}, options = {type: 'category'}) {

        const baseModelColumns = Object.keys(this.attributes).map(attribute => `${this.table}.${attribute} as ${this.table}_${attribute}`).join(', ');

        this.query = `SELECT ${baseModelColumns}
                      FROM ${this.table} `;

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


    /**
     * The `create` function inserts data into a table, with an option to automatically update the created_at and
     * updated_at fields with the current timestamp.
     * @param data - The `data` parameter is an object that contains the data to be inserted into the database table. Each
     * key-value pair in the `data` object represents a column name and its corresponding value.
     * @param [options] - The `options` parameter is an object that can have the following property:
     * @returns the result of the `this.promise` method call.
     */
    create(data, options = {touchTimestamp: true}) {
        if (options.touchTimestamp) {
            data.created_at = getUnixTime(new Date())
            data.updated_at = getUnixTime(new Date())
        }

        const fields = Object.keys(data).join(', ');

        const placeholders = Object.keys(data).map(() => '?').join(', ');
        console.log('bindings')
        return this.promise(`INSERT INTO ${this.table} (${fields})
                             VALUES (${placeholders})`, Object.values(data), 'run');
    }

    /**
     * The `update` function updates a record in a database table with the provided data and conditions, and also updates
     * the created_at and updated_at timestamps if specified.
     * @param [params] - An object containing the fields and values to be used as conditions in the WHERE clause of the SQL
     * query. These conditions will be used to filter the rows that will be updated.
     * @param data - The `data` parameter is an object that contains the values to be updated in the database. Each
     * key-value pair in the `data` object represents a column name and its corresponding value.
     * @param [options] - The `options` parameter is an object that can have two properties:
     * @returns a promise that executes an SQL UPDATE statement.
     */
    update(params = {}, data, options = {touchTimestamp: true, updating: false}) {

        if (options.touchTimestamp) {
            if (!options.updating) {
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

        return this.promise(`UPDATE ${this.table}
                             SET ${placeholders}
                             WHERE ${allConditions}`, bindings, 'run');
    }

    /**
     * The function deletes rows from a table based on specified conditions.
     * @param [params] - An object containing the fields and values to be used as conditions for the delete operation.
     * @returns a promise that executes a DELETE SQL query.
     */
    delete(params = {}) {

        let conditions = Object.keys(params).map(field => {
            return params[field] === null ? `${this.table}.${field} IS ?` : `${this.table}.${field} = ?`;
        });

        let allConditions = conditions.join(' AND ');
        let bindings = Object.values(params);

        return this.promise(`DELETE
                             FROM ${this.table}
                             WHERE ${allConditions}`, bindings, 'run');
    }

    /**
     * The get function retrieves a specified number of rows from a database table.
     * @param [limit=10] - The limit parameter specifies the maximum number of rows to be returned from the database query.
     * In this case, it is set to a default value of 10, but it can be changed to any positive integer value.
     * @returns a promise that executes a SQL query to select all rows from a table with a specified limit. The limit is
     * passed as a parameter to the function.
     */
    get(limit = 10) {
        return this.promise(`SELECT *
                             FROM ${this.table} limit ?`, [limit]);
    }

    /**
     * The function "all" returns all the elements found.
     * @returns The `findAll()` method is being called and its return value is being returned.
     */
    all() {
        return this.findAll();
    }

    /**
     * The function "find" retrieves the last row from a table based on the provided id.
     * @param id - The `id` parameter is the value used to filter the query results. It is used in the `WHERE` clause of
     * the SQL query to specify that only rows with a matching `id` should be returned.
     * @returns the result of a database query.
     */
    find(id) {
        return this.promise(`SELECT *
                             FROM ${this.table}
                             where id = ?
                             order by id desc limit 1`, [id], 'get');
    }

    /**
     * The function `first()` returns a promise that executes a SQL query to select the first row from a specified table.
     * @returns the result of a promise that executes a SQL query to select all columns from a table, with a limit of 1
     * row.
     */
    first() {
        return this.promise(`SELECT *
                             FROM ${this.table} limit 1`,);
    }

    /**
     * The "store" function takes in data and returns the result of calling the "create" function with that data. aka `create`
     * @param data - The "data" parameter is the information that you want to store or save. It can be any type of data,
     * such as a string, number, object, or array.
     * @returns The create method is being returned.
     */
    store(data) {

        return this.create(data);
    }

    /**
     * The `promise` function is a JavaScript function that executes a database query and returns a promise that resolves
     * with the query results.
     * @param query - The SQL query to be executed.
     * @param [binding] - The `binding` parameter is an optional array that contains values to be bound to the placeholders
     * in the query. These values are used to replace the placeholders in the query with actual values at runtime.
     * @param [method=all] - The `method` parameter specifies the method to be used for executing the query. It has a
     * default value of `'all'`. Other possible values are `'get'`, `'first'`, `'pluck'`, `'count'`, `'insert'`,
     * `'update'`, and `'delete'`.
     * @param [withRelations] - An array of relations that you want to include in the query results. These relations are
     * specified as strings and should match the names of the relations defined in the model.
     * @returns a Promise.
     */
    promise(query, binding = [], method = 'all', withRelations = []) {
        // console.info(query, binding)
        const self = this;
        return new Promise((resolve, reject) => {
            this.db[method](query, binding, function (err, result) {
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


    /**
     * The function sets the attributes of an object based on the provided data.
     * @param data - The `data` parameter is an object that contains the attributes to be set. Each key in the `data`
     * object corresponds to an attribute in the `this.attributes` object. The value of each key in the `data` object will
     * be assigned to the corresponding attribute in the `this.attributes`
     * @returns the object itself (this).
     */
    setAttributes(data) {
        for (const key in this.attributes) {
            if (data[key] !== undefined) {
                this.attributes[key] = data[key];
            }
        }
        this.loaded = true;

        return this;
    }

    /**
     * The function sets extra attributes to an object and returns the object.
     * @param key - The key parameter is a string that represents the name of the attribute you want to set. It is used as
     * the key in the attributes object to store the value.
     * @param value - The value parameter is the value that you want to assign to the specified key in the attributes
     * object.
     * @returns the object itself (this) after setting the extra attribute.
     */
    setExtraAttributes(key, value) {
        // console.log(value)
        this.attributes[key] = value;

        return this;
    }

    /**
     * The function isLoaded() returns the value of the loaded property.
     * @returns The value of the "loaded" property.
     */
    isLoaded() {
        return this.loaded;
    }

    /**
     * The function returns the time elapsed since the last update in a human-readable format.
     * @returns the formatted distance between the validated "updated_at" date and the current date, with the option to add
     * a suffix indicating whether the distance is in the past or future. If an error occurs during the execution of the
     * function, an empty string is returned.
     */
    getUpdatedAt() {

        try {
            return formatDistance(this.validateDate(this?.attributes?.updated_at), new Date(), {addSuffix: true})
        } catch (e) {
            console.log(e)
        }
        return '';
    }

    /**
     * The function `getCreatedAt()` returns the time difference between the `created_at` date attribute and the current
     * date in a human-readable format.
     * @returns the formatted distance between the "created_at" date and the current date, with the option to add a suffix
     * indicating whether the distance is in the past or future. If there is an error, it will log the error to the
     * console. If there is no "created_at" date, it will return an empty string.
     */
    getCreatedAt() {

        try {
            return formatDistance(this.validateDate(this?.attributes?.created_at), new Date(), {addSuffix: true})
        } catch (e) {

            console.log(e)
        }
        return '';
    }

    /**
     * The function "validateDate" accepts a date parameter and returns a parsed date object either from a string or from a
     * Unix timestamp.
     * @param date - The `date` parameter can be either a string or a number. If it is a string, it should be a valid date
     * string that can be parsed by the `parseISO` function. If it is a number, it should be a valid Unix timestamp that
     * can be converted to a date using
     * @returns either the parsed date from a string using the parseISO function, or the date converted from a Unix
     * timestamp using the fromUnixTime function.
     */
    validateDate(date) {

        if (typeof date === 'string') {

            return parseISO(date)
        }

        return fromUnixTime(date)
    }


    /**
     * The function returns the value of the "id" attribute.
     * @returns The value of the "id" attribute.
     */
    getId() {
        return this.attributes.id;
    }

    /**
     * The getSlug function returns a lowercase version of the name attribute with non-alphanumeric characters replaced by
     * hyphens.
     * @returns a slug version of the name attribute. A slug is a URL-friendly version of a string, typically used in URLs
     * to represent a page or resource. The function converts the name attribute to lowercase and replaces any
     * non-alphanumeric characters with a hyphen.
     */
    getSlug() {

        return (this.attributes.name || '')?.toLowerCase()?.replace(/[^a-z0-9]+/g, '-');
    }

    /**
     * The function `getUrl()` returns a formatted URL string based on the attributes of the object.
     * @returns a URL string that includes the category ID and its corresponding slug.
     */
    getUrl() {

        return `/categories/${this.attributes.id}-${this.getSlug()}`
    }

    /**
     * The getTitle function limits the length of a string and adds an ellipsis at the end if it exceeds the specified
     * limit.
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
     * The function checks if the "published_at" attribute is present and returns a boolean value.
     * @returns a boolean value. It checks if the "published_at" attribute exists and is truthy, and returns true if it is,
     * and false otherwise.
     */
    isPublished() {

        return Boolean(this?.attributes?.published_at);
    }

    /**
     * The function checks if an object has a parent_id attribute and returns a boolean value.
     * @returns a boolean value. It checks if the object has a non-null and non-undefined value for the "parent_id"
     * attribute. If it does, it returns true, indicating that the object is a child. If it doesn't, it returns false,
     * indicating that the object is not a child.
     */
    isChild() {

        return Boolean(this?.attributes?.parent_id);
    }

    /**
     * The function checks if the current object is a parent by calling the isChild() function and negating the result.
     * @returns The function isParent() returns the opposite of the result of the isChild() function.
     */
    isParent() {
        return !this.isChild();
    }

    /**
     * The function returns the state of a publication, either "Published" or "Drafted".
     * @returns the state of the publication, which is either "Published" or "Drafted".
     */
    getPublishedState() {
        return this.isPublished() ? 'Published' : 'Drafted'
    }

    /**
     * The function "getPublishedAtForHumans" returns the formatted date and time of the publication if it exists,
     * otherwise it returns the publication state.
     * @returns the published date in a human-readable format.
     */
    getPublishedAtForHumans() {

        const published = this.getPublished();
        if (!published) {
            return this.getPublishedState();
        }

        return format(published, 'Y-m-d H:i:s')
    }

    /**
     * The function `getPublishedAt()` returns the time difference between the current date and the published date in a
     * human-readable format.
     * @returns the result of the `formatDistance` function, which calculates the distance between the `published` date and
     * the current date. The result is a string that represents the time difference between the two dates, with an optional
     * suffix indicating whether the time is in the past or future.
     */
    getPublishedAt() {

        const published = this.getPublished();
        if (!published) {
            return null;
        }

        return formatDistance(published, new Date(), {addSuffix: true})
    }

    /**
     * The function `getPublished()` returns the published date in either ISO format or Unix timestamp format.
     * @returns The function `getPublished()` returns the parsed date and time value of the `published_at` attribute. If
     * the `published_at` attribute is not present or is null, the function returns null. If the `published_at` attribute
     * is a string, it is parsed using the `parseISO()` function and the parsed date and time value is returned. If the
     * `published_at` attribute is a
     */
    getPublished() {
        const published = this?.attributes?.published_at;

        if (!published) {
            return null;
        }


        if (typeof published === 'string') {

            return parseISO(published)
        }

        return fromUnixTime(published)
    }

}

module.exports = BaseModel;