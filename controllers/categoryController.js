const Blog = require('../models/blog');

/* The BlogController class is responsible for retrieving and rendering blog posts based on category and tag. */

class BlogController {
    /**
     * The constructor function sets the initial value of the "path" property and binds the "show" method to the current
     * instance.
     */
    constructor() {
        this.path = 'categories/';
        this.show = this.show.bind(this);
    }

    /**
     * This function retrieves blog posts based on a category and tag, and renders them in a view.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as the request headers, request parameters, and request body.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to control the response, such as setting headers, sending data, and
     * redirecting the client to a different URL.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     * @returns a response object with the rendered view and the blog posts as data.
     */
    async show(req, res, next) {
        let category = req.params?.category ? req.params?.category?.split('-')[0] : null;
        let tag = req.params?.tag ? req.params?.tag?.split('-')[0] : null;

        console.log(tag, category);
        if (! category || ! tag) {
          return res.redirect('not-found');
        }

        let posts = [];
        if (tag) {
            posts = await (new Blog()).searchBy({id: tag}, {type: 'tags'});
        } else if(category) {
            posts = await (new Blog()).searchBy({id: category});
        }

        // console.log(posts)
        // in case we don't have any post let's make early return ...
        // if(! post.isLoaded()) {
        //     return res.redirect('not-found');
        // }
        res.render(this.path + 'show', { blogs: Array.isArray(posts) ? posts : [posts] });
    }

}

module.exports = new BlogController();