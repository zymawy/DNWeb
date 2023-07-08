
const BaseModel = require('./baseModel')
const {strLimit} = require("../helpers/capitalize");
const {th} = require("date-fns/locale");
class Category extends BaseModel{
    constructor() {
        super('categories', {}, {
            'id': null,
            'name': null,
            'updated_at': null,
            'created_at': null
        });

        let that = this;
        this.relations = {
            get post_categories() {
                return {
                    type: 'hasMany',
                    model: {
                        attributes: {
                            'post_id': null,
                            'category_id': null
                        },
                        table: 'post_categories',
                        join: 'LEFT',
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

        that.post_categories = [];
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


    getPostsCategories() {
        return [this.post_categories, this.post_categorie];
        if (this.post_categorie  && Array.isArray(this.post_categorie)) {
            return this.post_categorie;
        }

        return this.post_categories;
    }
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
}

module.exports = Category