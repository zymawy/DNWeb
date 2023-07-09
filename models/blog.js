const Model = require('./baseModel');
const Comment = require('./comment');
const {strLimit} = require('./../helpers/capitalize')

/* The `Blog` class represents a blog post with properties and relationships to other models such as users and comments,
and includes methods for calculating estimated read time, getting the slug, URL, title, subtitle, thumbnail, read
visits, description, comments, reactions, tags, and categories of the blog post. */
class Blog extends Model {

    /**
     * This is a constructor function for a JavaScript class that represents a blog post, with properties and relationships
     * to other models such as users and comments.
     * @param [blogs] - The `blogs` parameter is an object that contains the data for the blogs. It is an optional
     * parameter and if not provided, it defaults to an empty object `{}`.
     * @returns The constructor is returning an object with properties and methods.
     */
    constructor(blogs = {}) {
        super('posts', blogs, {
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
            }
        );

        this.table = 'posts';


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
                        }
                    }
                };
            },
            get comments() {
                return {
                    type: 'hasMany',
                    model: {
                        attributes: {
                            'id': null,
                            'post_id': null,
                            'comment': null,
                            'parent_id': null,
                            'reader_id': null,
                            'published_at': null,
                        },
                        table: 'comments',
                        join: 'INNER',
                        setAttributes: function (data) {
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

        this.comments = {}
        this.user = {}
    }


    /**
     * The function `calculateEstimatedReadTime()` calculates the estimated read time for a given text based on the average
     * reading speed of 200 words per minute.
     * @returns the estimated read time in minutes.
     */
    calculateEstimatedReadTime() {
        if (['', "", null, undefined].includes(this.attributes?.description)) {
            return 0;
        }
        /**
         * according to @see https://www.sciencedirect.com/science/article/abs/pii/S0749596X19300786#:~:text=The%20average%20oral%20reading%20rate,of%20reading%2Dspecific%20language%20processing.
         * the average between 183 and 238 so here I but 200.just for demonstration purpose
         * @type {number}
         */
        const averageReadingSpeed = 200;
        // i'm clean up html tags save from rich text editor
        const cleanedContent = this.attributes?.description?.replace(/<[^>]+>/g, '').trim();

        const words = cleanedContent?.split(/\s+/);

        return Math.ceil(this.getTotalWordsCount(words) / averageReadingSpeed) || 0;
    }

    /**
     * The function `getTotalWordsCount` returns the total number of words in a given array or in the description attribute
     * of an object.
     * @param [words=null] - The `words` parameter is an optional array of words.
     * @returns the total count of words in the given input. If the "words" parameter is not null, it returns the length of
     * the "words" array. Otherwise, it calculates the length of the "description" attribute after removing any HTML tags
     * using a regular expression.
     */
    getTotalWordsCount(words = null) {

        return words != null ? words?.length : this.attributes?.description?.replace(/<[^>]+>/g, '')?.trim()?.length;
    }

    /**
     * The recursiveComments function takes an array of comments and a parent ID, and recursively creates a nested
     * structure of comments and replies based on the parent-child relationship.
     * @param comments - An array of comment objects. Each comment object has the following properties:
     * @param [parentId=null] - The `parentId` parameter is used to specify the ID of the parent comment. It is used to
     * filter the comments and retrieve only the comments that have the specified parent ID. This allows the function to
     * recursively find the child comments of a parent comment.
     * @returns the `result` array, which contains the comments that match the given `parentId` and their respective
     * replies.
     */
    recursiveComments(comments, parentId = null) {
        const result = [];

        for (const comment of comments) {
            if (comment.attributes.parent_id === parentId) {
                const children = this.recursiveComments(comments, comment.attributes.id);
                if (children.length > 0) {
                    /**
                     * we have all comments that the parent has let's create
                     * respectively create comments replies and make our UI
                     *  more interactive
                     */
                    children.forEach((child) => {
                        comment.replies = comment?.replies || []
                        let childModel = (new Comment()).setAttributes(child.attributes);
                        // if we have relations
                        if (child.user)
                            childModel.user = child.user;

                        comment?.replies?.push(childModel);
                        // comment.user =.attributes;
                    })
                }
                // console.log(comment)
                // mainComment.replies = comment;
                // mainComment.setAttributes(comment)
                // result.push(mainComment);
                result.push(comment);

                // comment.clean()
                // result.push((new Comment()).setAttributes(comment).setExtraAttributes('replies', comment.replies));
            }
        }

        return this.comments = result;
    }

    /**
     * The getSlug function returns a lowercase version of the title attribute with non-alphanumeric characters replaced by
     * hyphens.
     * @returns a slugified version of the title attribute.
     */
    getSlug() {

        return (this.attributes.title || '')?.toLowerCase()?.replace(/[^a-z0-9]+/g, '-');
    }

    /**
     * The function `getUrl()` returns a formatted URL for a blog post based on its ID and slug.
     * @returns a URL string that includes the blog's ID and slug.
     */
    getUrl() {

        return `/blogs/${this.attributes.id}-${this.getSlug()}`
    }

    /**
     * The `getTitle` function limits the length of a string and appends an end character if the string exceeds the
     * specified limit.
     * @param [limit=100] - The limit parameter specifies the maximum number of characters that the title should be limited
     * to. If the title exceeds this limit, it will be truncated.
     * @param [end=...] - The "end" parameter is a string that will be appended to the end of the title if it exceeds the
     * specified limit. For example, if the title is "Lorem ipsum dolor sit amet", and the limit is set to 10, the returned
     * title will be "Lorem ipsu...".
     * @returns a truncated version of the title attribute, with a specified character limit and an optional ending string.
     */
    getTitle(limit = 100, end = '...') {
        return strLimit(this.attributes.title, limit, end)
    }

    /**
     * The function "getSubTitle" returns a shortened version of the subtitle attribute, with a specified character limit
     * and an optional ending string.
     * @param [limit=100] - The limit parameter specifies the maximum number of characters that the subtitle should be
     * limited to. If the subtitle is longer than the limit, it will be truncated.
     * @param [end=...] - The "end" parameter is a string that will be appended to the end of the subtitle if it is
     * truncated. By default, it is set to '...'.
     * @returns a substring of the `subtitle` attribute, limited to a specified `limit` number of characters. If the
     * substring is shorter than the `limit`, it will be returned as is. If it is longer, the `end` parameter will be
     * appended to the substring before returning it.
     */
    getSubTitle(limit = 100, end = '...') {

        return strLimit(this.attributes.subtitle, limit, end)
    }

    /**
     * The getThumbnail function returns the value of the thumbnail attribute.
     * @returns The thumbnail attribute.
     */
    getThumbnail() {

        return this.attributes.thumbnail;
    }

    /**
     * The function returns the number of read visits from the attributes object, or 0 if it is not defined.
     * @returns The value of `this.attributes.read_visits` or 0 if `this.attributes.read_visits` is undefined.
     */
    getReadVisits() {

        return this.attributes.read_visits || 0;
    }

    /**
     * The getDescription function returns the description attribute if it exists, otherwise it returns an empty string.
     * @returns The description attribute value if it exists, otherwise an empty string.
     */
    getDescription() {

        return this.attributes?.description || ''
    }

    /**
     * The function `getComments` retrieves comments for a blog post and returns them as an array.
     * @returns an array of comments for a specific blog post.
     */
    async getComments() {

        // console.log(this.comments)
        // if (this.comments.length) {}
        // let's get the comments for this blogs
        let postComments = await (new Comment()).findBy({post_id: this.getId()});

        if (!Array.isArray(postComments)) {
            return [];
        }
        //
        // // console.log(this.comments = this.recursiveComments(postComments))
        // // let's build comments replays by using recursive ...
        // return this.comments = this.recursiveComments(postComments)
    }

    getReactions() {
        return [];
    }

    getTags() {
        return [];
    }

    getCategories() {
        return [];
    }
}

module.exports = Blog;