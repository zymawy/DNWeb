const BaseModel = require('./baseModel')
const {comment} = require("postcss");
const {th} = require("date-fns/locale");
const {dd, dump} = require("../helpers/capitalize");
class Comment extends BaseModel{

    constructor() {


        super('comments', {}, {
            'id': null,
            'post_id': null,
            'comment': null,
            'parent_id': null,
            'user_id': null,
            'published_at': null,
            'updated_at': null,
            'created_at': null,
            // 'replies': []
        });

        let that = this;
        this.relations = {
            get user() {
                return {
                    type: 'belongsTo',
                    model: {
                        attributes: {
                            'id': null,
                            'full_name': null,
                            'email': null,
                            // 'password': null, // we dont need password to be visible
                            'is_admin': null,
                        },
                        table: 'users',
                        join: 'LEFT',
                        setAttributes: function (data) {
                            for (const key in this.attributes) {
                                if (data[key] !== undefined) {
                                    this.attributes[key] = data[key];
                                }
                            }
                            this.loaded = true;
                            delete this.table

                            that.user = this.attributes;
                        }
                    }
                };
            },
            get post() {
                return {
                    type: 'belongsTo',
                    model: {
                        attributes: {
                            'id': null,
                            'user_id': null,
                            'title': null,
                            'published_at': null,
                            'status': null,
                            'description': null,
                            'thumbnail': null,
                            'is_featured': null,
                            'subtitle': null,
                            'created_at': null,
                            'deleted_at': null,
                            'updated_at': null,
                            'author_name': null,
                            'read_visits': null
                        },
                        table: 'posts',
                        join: 'LEFT',
                        setAttributes: function (data) {
                            for (const key in this.attributes) {
                                if (data[key] !== undefined) {
                                    this.attributes[key] = data[key];
                                }
                            }
                            this.loaded = true;
                            delete this.table

                            that.user = this.attributes;
                        }
                    }
                };
            },
        }

        this.user = {};
        this.post = {};
    }

    getComment() {

        return this.attributes.comment || '';
    }

    getAuthor() {

        return this.attributes.comment || '';
    }

    setAttributes(data) {
        for (const key in this.attributes) {
            // if (data[key] !== undefined) {
                this.attributes[key] = data[key];
            // }
        }
        this.loaded = true;

        this.relations = null;
        this.query = null;

        // console.log(this.relations)
        return this;
    }

    clean() {
        ['relations', 'data', 'db', 'table'].forEach((key, value) => {
          // let isDeleted = delete `${key}`
            // console.log(isDeleted, key)
        })
    }

    getComment() {

        return this?.attributes?.comment || '';
    }

}
module.exports = Comment