const Blog = require('../../models/blog');
const Tag = require('../../models/tag')
const PostTag = require('../../models/postTag')
const PostCategory = require('../../models/postCategory')
const Category = require('../../models/category')
const multer = require('multer');
const {getUnixTime} = require("date-fns");
const {validationResult} = require("express-validator");
const upload = multer({ dest: 'uploads/' });
class BlogController {
    constructor() {
        this.path = 'admin/blogs/';
        this.index = this.index.bind(this);
        this.edit = this.edit.bind(this);
        this.create = this.create.bind(this);
    }
   async index(req, res, next) {

      const posts = await (new Blog).findBy({}, ['user'], [], {order: 'desc', by: 'posts.id'});


       res.render(this.path + 'index', { posts: posts, title: 'All blogs' });

    }
    async edit(req, res, next) {

        const post = await  (new Blog()).findBy({id: req.params.id});
        const tags = await (new Tag).findAll({});
        const categories = await (new Category()).findAll({});
        let postTags = await (new PostTag()).findBy({post_id: req.params.id })
        let postCategory = await (new PostCategory()).findBy({post_id: req.params.id })
        if (Array.isArray(postCategory)  || postCategory.isLoaded()) {
            postCategory = Array.isArray(postCategory) ? postCategory : [postCategory];
            postCategory = postCategory.map((ct) => ct?.attributes?.category_id)
        }

        if (Array.isArray(postTags) || postTags.isLoaded()) {
            postTags = Array.isArray(postTags) ? postTags : [postTags];
            postTags = postTags.map((ct) => ct?.attributes?.tag_id)
        }

        // return res.json({post, title:"Create Post", tags, categories,postCategory, postTags})
        return res.render(this.path + 'create',
            {post, title:"Create Post", tags, categories,postCategory, postTags});
    }

    async store(req, res, next) {

        const result = validationResult(req);

        /**
         * We have va;datpom error
         */
        if (result.isEmpty() === false) {
            return res.status(422).send({ errors: result.array() });
        }

        // in case it's update case
        const postId = req.params.id;

        const title = req.body.title;
        const subtitle = req.body.subtitle;
        const desc = req.body.desc;
        const status = req.body.status;
        const tags = req.body.tags || [];
        const categories = req.body.categories || [];

        // in case it's published let's set the current time
        const published  = status === 'published' ? getUnixTime(new Date()) : null;
        const post = {
            title,
            subtitle,
            'description': desc,
            'published_at': published,
            user_id: res.locals.currentUser.getId(),
        }

        // if we have a thumbnail with request and successfully uploaded from mutlar to the storage...
        console.log(req.file)
        if(req.file) {
            post.thumbnail = req.file.path.replace('public', '');
        }
        let p = {};
        if (postId) {
            p = await (new Blog()).update( {id: postId }, post);
        } else {
            // let's create the posts with crossnding values
            p = await (new Blog()).create(post);
        }

        if (! p.isLoaded() && postId) {
            p.lastID = postId;
        }
        // let's create an associative tags and assign it to the post we created!
        if (tags.length) {
            // lets delete any pervose tags for this post
            if (postId) {
                await  (new PostTag().delete({post_id: postId }));
            }

            tags.forEach(async (tagId) => {
                await  (new PostTag().create({post_id: p.lastID, tag_id: tagId }, {touchTimestamp: false}))
            })
        }

        // let's create an associative category and assign it to post we created!
        if (categories.length) {
            // lets delete any pervose tags for this post
            if (postId) {
                await  (new PostCategory().delete({post_id: postId }));
            }
            categories.forEach(async (categoryId) => {
               await (new PostCategory().create({post_id: p.lastID, category_id: categoryId }, {touchTimestamp: false}))
            })
        }

        return res.status(201).json({ id: p.lastID })
    }
    async create (req, res, next) {

        const tags = await (new Tag).findAll({});
        const categories = await (new Category()).findAll({});

        res.render(this.path + 'create', {title:"Create Post", tags, categories });
    }

    async delete(req, res, next) {
        const { id } = req.params

        await (new Blog()).delete({id : id })

        return res.status(200).json(id);
    }
}
module.exports = new BlogController();