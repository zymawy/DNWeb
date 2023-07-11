const Blog = require('../../models/blog');
const Tag = require('../../models/tag')
const PostTag = require('../../models/postTag')
const PostCategory = require('../../models/postCategory')
const Category = require('../../models/category')
const {getUnixTime} = require("date-fns");
const {validationResult} = require("express-validator");
const Comment = require("../../models/comment");

/* The BlogController class handles the CRUD operations for blog posts, including retrieving all posts, creating and
editing posts, and deleting posts. */
class BlogController {
    /**
     * The constructor function initializes the path property and binds the index, edit, and create methods to the current
     * object.
     */
    constructor() {
        this.path = 'admin/blogs/';
        this.index = this.index.bind(this);
        this.edit = this.edit.bind(this);
        this.create = this.create.bind(this);
    }

    /**
     * The index function retrieves all blog posts with associated user information and renders them in a view with the
     * title "All blogs".
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request.
     * @param res - The "res" parameter is the response object that is used to send a response back to the client. It is
     * typically used to send HTML, JSON, or other types of data back to the client. In this case, the "res" object is
     * being used to render a view template and send
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     * @returns a rendered view with the posts and title as data.
     */
    async index(req, res, next) {

        const {state} = req.query;
        const query = {};
        let notNullable = [];
        let nullable = [];
        if (state === 'published') {
            notNullable.push('published_at');
            nullable = [];
        } else if(state === 'drifted') {
            notNullable = [];
            nullable.push('published_at')

        }

        let posts = await (new Blog()).findBy({}, ['user'], notNullable, {order: 'desc', by: 'posts.id'}, nullable);

        posts = (! Array.isArray(posts) && typeof posts === 'object' && posts.isLoaded()) ? [posts] : posts;

        return res.render(this.path + 'index', {posts: posts, title: 'All blogs'});
    }

    /**
     * The function retrieves data from the database and renders a create post page with the retrieved data.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request,
     * such as the request headers, request parameters, and request body.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to manipulate the response, such as setting headers, sending data, or
     * rendering views. In this code snippet, the `res` object is used to render
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     * @returns a rendered view with the data passed as parameters.
     */
    async edit(req, res, next) {

        const post = await (new Blog()).findBy({id: req.params.id});
        if (! post) {
            return res.redirect('not-found');
        }

        let tags = await (new Tag).findAll({});
        let categories = await (new Category()).findAll({});
        tags = (! Array.isArray(tags) && typeof tags === 'object' && tags.isLoaded()) ? [tags] : tags;
        categories = (! Array.isArray(categories) && typeof categories === 'object' && categories.isLoaded()) ? [categories] : categories;

        let postTags = await (new PostTag()).findBy({post_id: req.params.id})
        let postCategory = await (new PostCategory()).findBy({post_id: req.params.id})
        if (Array.isArray(postCategory) || postCategory.isLoaded()) {
            postCategory = Array.isArray(postCategory) ? postCategory : [postCategory];
            postCategory = postCategory.map((ct) => ct?.attributes?.category_id)
        }

        if (Array.isArray(postTags) || postTags.isLoaded()) {
            postTags = Array.isArray(postTags) ? postTags : [postTags];
            postTags = postTags.map((ct) => ct?.attributes?.tag_id)
        }

        // return res.json({post, title:"Create Post", tags, categories,postCategory, postTags})
        return res.render(this.path + 'create', {post, title: "Edit " + post.getTitle(), tags, categories, postCategory, postTags});
    }

    /**
     * This function handles the storage of a blog post, including updating or creating a new post, assigning tags and
     * categories, and returning the ID of the post.
     * @param req - The req parameter is the request object that contains information about the HTTP request made by the
     * client. It includes data such as the request headers, request body, request parameters, etc.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to control the response, such as setting the status code, sending
     * JSON data, or redirecting the client to another URL.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used for error handling or to move on to the next middleware
     * function after the current one has completed its task.
     * @returns a response with status code 201 and a JSON object containing the ID of the created or updated post.
     */
    async store(req, res, next) {

        const result = validationResult(req);

        /**
         * We have error
         */
        if (result.isEmpty() === false) {
            return res.status(422).send({errors: result.array()});
        }

        // in case its update case
        const postId = req.params.id;

        const title = req.body.title;
        const subtitle = req.body.subtitle;
        const desc = req.body.desc;
        const status = req.body.status;
        const tags = req.body.tags || [];
        const categories = req.body.categories || [];

        // in case it's published let's set the current time
        const published = status === 'published' ? getUnixTime(new Date()) : null;
        const post = {
            title, subtitle, 'description': desc, 'published_at': published, user_id: res.locals.currentUser.getId(),
        }

        // if we have a thumbnail with request and successfully uploaded from mutlar to the storage...
        console.log(req.file)
        if (req.file) {
            post.thumbnail = req.file.path.replace('public', '');
        }
        let p = {};
        if (postId) {
            p = await (new Blog()).update({id: postId}, post, {touchTimestamp: true, updating: true});
        } else {
            // let's create the posts with crossing values
            p = await (new Blog()).create(post);
        }

        if (!p.isLoaded() && postId) {
            p.lastID = postId;
        }
        // let's create an associative tags and assign it to the post we created!
        if (tags.length) {
            // lets delete any pervose tags for this post
            if (postId) {
                await (new PostTag().delete({post_id: postId}));
            }

            tags.forEach(async (tagId) => {
                await (new PostTag().create({post_id: p.lastID, tag_id: tagId}, {touchTimestamp: false}))
            })
        }

        // let's create an associative category and assign it to post we created!
        if (categories.length) {
            // lets delete any pervose tags for this post
            if (postId) {
                await (new PostCategory().delete({post_id: postId}));
            }
            categories.forEach(async (categoryId) => {
                await (new PostCategory().create({post_id: p.lastID, category_id: categoryId}, {touchTimestamp: false}))
            })
        }

        return res.status(201).json({id: p.lastID})
    }

    /**
     * The function "create" renders a view with the title "Create Post" and passes in the tags and categories data.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as the request headers, request method, request URL, and request body.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to control the response, such as setting headers, status codes, and
     * sending data back to the client. In this code snippet, the `res` object
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used to handle errors or to move on to the next middleware
     * function.
     */
    async create(req, res, next) {

        let tags = await (new Tag).findAll({});
        let categories = await (new Category()).findAll({});

        tags = (! Array.isArray(tags) && typeof tags === 'object' && tags.isLoaded()) ? [tags] : tags;
        categories = (! Array.isArray(categories) && typeof categories === 'object' && categories.isLoaded()) ? [categories] : categories;


        res.render(this.path + 'create', {title: "Create Post", tags, categories});
    }

    /**
     * The delete function deletes a blog entry with the specified ID and returns the ID in the response.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as headers, query parameters, and request body.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to set the response status, headers, and body. In this code snippet,
     * `res` is used to send a JSON response with a status code of
     * @param next - The `next` parameter is a function that is used to pass control to the next middleware function in the
     * request-response cycle. It is typically used when there is an error or when the current middleware function has
     * completed its task and wants to pass control to the next middleware function.
     * @returns The ID of the deleted blog post is being returned as a JSON response.
     */
    async delete(req, res, next) {
        const {id} = req.params

        await (new Blog()).delete({id: id})

        return res.status(200).json(id);
    }

    async approve(req, res, next) {
        const {id} = req.params

        const c = await (new Blog()).update({id: id}, {'published_at':  getUnixTime(new Date())}, {touchTimestamp: true, updating: true })

        return res.status(200).json(c);
    }
}

module.exports = new BlogController();