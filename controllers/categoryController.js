const Blog = require('../models/blog');
const Comment = require('../models/comment');
const Tag = require('../models/tag');
const User = require('../models/User');
class BlogController {
    constructor() {
        this.path = 'category/';
        this.show = this.show.bind(this);
    }
    async show(req, res, next) {
        let category = req.params.category.split('-')[0] ?? null;

        if (! category) {
          return res.redirect('not-found');
        }

        // let's get the post by id ...

       let post = await (new Blog()).findBy({id: category}, ['user']);

        // in case we don't have any post let's make early return ...
        // if(! post.isLoaded()) {
        //     return res.redirect('not-found');
        // }
        res.render(this.path + 'show', { blog: post , title: post.name, sidebarInfo: [] });
    }

}
module.exports = new BlogController();