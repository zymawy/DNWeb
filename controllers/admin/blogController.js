const Blog = require('../../models/blog');
class BlogController {
    constructor() {
        this.path = 'admin/blogs/';
        this.index = this.index.bind(this);
        this.show = this.show.bind(this);
        this.edit = this.edit.bind(this);
        this.create = this.create.bind(this);
    }
    register(req, res, next) {

    }
    index(req, res, next) {
        Blog.all()
            .then( (results) => {
                res.render(this.path + 'index', { blogs: results, title: 'All blogs' });
            })
            .catch((err) => {
                console.log(err)
        });
    }
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

    store(req, res, next) {
        Blog.store(req.body)
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
    create (req, res, next) {
        res.render(this.path + 'create', {title:"Create Post", sidebarInfo: []});
    }
    show(req, res, next) {
        Blog.find(req.params.id)
            .then( (results) => {
                if (results) {
                    res.render(this.path + 'show', { blog: results , title: results.name, sidebarInfo: [] });
                }

                throw new Error('Not Found! ');
            })
            .catch((err) => {
                console.log(err)
            });
    }
}
module.exports = new BlogController();