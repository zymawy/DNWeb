const Blog = require('../models/blog');
class BlogController {
    constructor() {
        this.path = 'categories/';
        this.show = this.show.bind(this);
    }
    async show(req, res, next) {
        let category = req.params?.category ? req.params?.category?.split('-')[0] : null;
        let tag = req.params?.tag ? req.params?.tag?.split('-')[0] : null;

        console.log(tag, category);
        if (! category || ! tag) {
          return res.redirect('not-found');
        }

        // let's get the post by id ...
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