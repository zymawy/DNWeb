const Model = require('./baseModel');
const User = require('./user');
const Comment = require('./comment');
const { strLimit } = require('./../helpers/capitalize')
const { formatDistance, subDays, format, parseISO} =  require('date-fns')
const {th} = require("date-fns/locale");
const {dump} = require("../helpers/capitalize");
var fromUnixTime = require('date-fns/fromUnixTime')
class Blog extends Model {
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

        this.comments = {}
        this.user = {}
    }

    getId() {
        return this.attributes.id;
    }


    calculateEstimatedReadTime() {
        if(['', "", null, undefined].includes(this.attributes?.description)) {
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

    getTotalWordsCount(words = null) {

        return words != null ? words?.length : this.attributes?.description?.replace(/<[^>]+>/g, '')?.trim()?.length;
    }



    // getAuthorName()

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

    getSlug() {

        return (this.attributes.title || '')?.toLowerCase()?.replace(/[^a-z0-9]+/g, '-');
    }

    getUrl() {

        return `/blogs/${this.attributes.id}-${this.getSlug()}`
    }

    getTitle(limit = 100, end = '...') {
        return strLimit(this.attributes.title, limit, end)
    }
    getSubTitle(limit = 100, end = '...') {

        return strLimit(this.attributes.subtitle, limit, end)
    }

    getThumbnail() {

        return this.attributes.thumbnail;
    }

    getReadVisits() {

        return this.attributes.read_visits || 0;
    }

    getDescription() {

        return this.attributes?.description || ''
    }

    async getComments () {

        // console.log(this.comments)
        // if (this.comments.length) {}
        // let's get the comments for this blogs
        let postComments = await (new Comment()).findBy({post_id: this.getId()});

        if (! Array.isArray(postComments)) {
            return  [];
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