const BaseModel = require('./baseModel')

/* The Comment class is a JavaScript class that represents a comment in an application, with attributes and relations to
other models. */
class Comment extends BaseModel {

    /**
     * The constructor function initializes an object with attributes and relations for a comment in a JavaScript
     * application.
     * @returns The constructor is returning an object with two properties: `user` and `post`.
     */
    constructor() {

        super('comments', {}, {
            'id': null,
            'post_id': null,
            'comment': null,
            'parent_id': null,
            'user_id': null,
            'published_at': null,
            'updated_at': null,
            'created_at': null, // 'replies': []
        });

        let that = this;
        this.relations = {
            get user() {
                return {
                    type: 'belongsTo', model: {
                        attributes: {
                            'id': null,
                            'full_name': null,
                            'email': null, // 'password': null, // we dont need password to be visible
                            'is_admin': null,
                        }, table: 'users', join: 'LEFT', setAttributes: function (data) {
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
            }, get post() {
                return {
                    type: 'belongsTo', model: {
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
                        }, table: 'posts', join: 'LEFT', setAttributes: function (data) {
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

    /**
     * The getAuthor function returns the comment attribute or an empty string.
     * @returns The comment attribute or an empty string if it is not defined.
     */
    getAuthor() {

        return this.attributes.comment || '';
    }

    /**
     * The function sets the attributes of an object based on the provided data.
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
        this.loaded = true;

        this.relations = null;
        this.query = null;

        // console.log(this.relations)
        return this;
    }

    /**
     * The function returns the value of the comment attribute, or an empty string if it is not defined.
     * @returns The comment attribute value is being returned. If the comment attribute is not present or is null, an empty
     * string is returned.
     */
    getComment() {

        return this?.attributes?.comment || '';
    }

}

module.exports = Comment