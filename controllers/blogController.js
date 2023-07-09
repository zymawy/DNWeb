const Blog = require('../models/blog');
const Comment = require('../models/comment');
const Tag = require('../models/tag');
const Category = require('../models/category');
const User = require('../models/User');

/* The BlogController class is responsible for handling requests related to blog posts, including displaying a list of
posts, editing a specific post, showing the details of a post, and performing a search query. */
class BlogController {
    /**
     * The constructor function initializes the path property and binds the index, show, edit, and query methods to the
     * current object.
     */
    constructor() {
        this.path = 'blogs/';
        this.index = this.index.bind(this);
        this.show = this.show.bind(this);
        this.edit = this.edit.bind(this);
        this.query = this.query.bind(this);
    }
    /**
     * This function retrieves a list of blog posts from a database and renders them on a webpage, with the option to
     * paginate or scroll through the posts.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as headers, query parameters, and body.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to control the response, such as setting headers, sending data, and
     * rendering views. In this code, the `res` object is used to render a
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     * @returns a rendered view with the blogs data. If the scrolling parameter is present, it renders the 'blogs' view
     * with the posts data. Otherwise, it renders the 'index' view with the posts data.
     */
    async index(req, res, next) {

     const blog = await  new Blog();

        const page = req.query.page || 1;
        const scrolling = req.query.scrolling || 0;
        const limit = 10; // Number of posts to return per page
        const offset = (page - 1) * limit;

     const posts = await blog.findAll({}, ['*'], {
         limit: limit,
         offset: offset,
         by: 'DESC',
         order: 'posts.id',
         onlyPublished: true
     });

     if (scrolling) {
        return  res.render(this.path + 'blogs', { blogs: Array.isArray(posts) ? posts : [] });
     }

    return  res.render(this.path + 'index', { blogs: posts });
    }


    /**
     * The function finds a blog by its ID, renders an edit page with the blog data, and throws an error if the blog is not
     * found.
     * @param req - The `req` parameter is an object that represents the HTTP request made by the client. It contains
     * information such as the request method, URL, headers, and any data sent in the request body.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to manipulate the response, such as setting headers, sending data,
     * and redirecting the client to a different URL.
     * @param next - The "next" parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     */
    edit(req, res, next) {
        Blog.find(req.params.id)
            .then( (results) => {
                if (results && results[0]) {
                    res.render(this.path + 'edit', { blog: results[0], title: 'Editing ' +  results[0].name });
                }

                throw new Error('Not Found! ');
            })
            .catch((err) => {
                console.log(err)
            });
    }


    /**
     * This function retrieves a blog post by its ID, along with its associated comments and tags, and renders the post on
     * a webpage.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as headers, query parameters, and request body.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to control the response, such as setting headers, sending data, and
     * rendering views. In this code, the `res` object is used to redirect the
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     * @returns a rendered view with the blog post data, including the title, comments, tags, and sidebar information.
     */
    async show(req, res, next) {

        let id = req.params.id.split('-')[0] ?? null;

        if (! id) {
          return res.redirect('/not-found');
        }
        // let's get the post by id ...

       let post = await (new Blog()).findBy({id: id}, ['user']);

        // in case we don't have any post let's make early return ...
        if(! post.isLoaded() || ! post.isPublished()) {
            return res.redirect('/not-found');
        }

       // let's get the comments for this blogs
       let postComments = await (new Comment()).findBy({post_id: post.getId()}, ['user']);

       // let's find the tags ...
        let postTags = await (new Tag()).findBys({post_id: post.getId()}, ['postTags']);

        let postCategories = await (new Category()).findBys({post_id: post.getId()}, ['postCategory']);

        if (Array.isArray(postComments) || (! Array.isArray(postComments) && typeof postComments === 'object' && postComments.isLoaded())) {

            post.comments = post.recursiveComments((! Array.isArray(postComments) && typeof postComments === 'object' && postComments.isLoaded()) ? [postComments] : postComments)
        } else  {
            post.comments = [];
        }

        if (Array.isArray(postTags) || (! Array.isArray(postTags) && typeof postTags === 'object' && postTags.isLoaded())) {
            post.tags = (! Array.isArray(postTags) && typeof postTags === 'object' && postTags.isLoaded()) ? [postTags] : postTags
        } else  {
            post.tags = [];
        }

        if (Array.isArray(postCategories) || (! Array.isArray(postCategories) && typeof postCategories === 'object' && postCategories.isLoaded())) {
            post.categories = (! Array.isArray(postCategories) && typeof postCategories === 'object' && postCategories.isLoaded()) ? [postCategories] : postCategories
        } else  {
            post.categories = [];
        }

        // for now let's keep it like this untill we find better approach
        if (post.user.loaded) {
            let user = new User();
            user.setAttributes(post.user.attributes)
            post.user = user;
        }

        // return res.json(post.tags);
        // console.log(req.session[`posts_${id}_visits_counts`] || 1)

        // if (res.cookie(`posts::${id}.vis`)) {
        //     res.sess('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        // }
        // console.log(post);

        // let's increase visits count

        await (new Blog()).update({id: id}, { read_visits: post.attributes.read_visits + 1 });

        res.render(this.path + 'show', { blog: post , title: post?.attributes?.title, sidebarInfo: [] });
    }

   /**
    * The function performs a search query using the provided query parameter and returns the results in JSON format.
    * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request.
    * It includes details such as the request method, headers, query parameters, and body.
    * @param res - The "res" parameter is the response object that is used to send the response back to the client. It
    * contains methods and properties that allow you to control the response, such as setting headers, status code, and
    * sending data back to the client.
    * @returns a JSON response. If the `results` variable is an array, it will be returned as is. If `results` is an object
    * and it is loaded, it will be wrapped in an array and returned. If neither of these conditions are met, an empty array
    * will be returned.
    */
   async query(req, res) {
        const query =  req.query.q;

        const blog = new Blog();

      const results = await blog.search(query);
      if (Array.isArray(results)) {
          return res.json(results);
      } else if(typeof results === 'object' && results.isLoaded()) {
          return res.json([results]);
      }

       return res.json([]);
    }

}

module.exports = new BlogController();