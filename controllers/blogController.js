const Blog = require('../models/blog');
const Comment = require('../models/comment');
const Tag = require('../models/tag');
const User = require('../models/User');
const {dd, dump} = require("../helpers/capitalize");
class BlogController {
    constructor() {
        this.path = 'blogs/';
        this.index = this.index.bind(this);
        this.show = this.show.bind(this);
        this.edit = this.edit.bind(this);
        this.query = this.query.bind(this);
    }
    register(req, res, next) {

    }
    async index(req, res, next) {

     const blog = await  new Blog();

        const page = req.query.page || 1;
        const scrolling = req.query.scrolling || 0;
        const limit = 10; // Number of posts to return per page
        const offset = (page - 1) * limit;

     const posts = await  blog.findAll({}, ['*'], {
         limit: limit,
         offset: offset,
     });

     if (scrolling) {
        return  res.render(this.path + 'blogs', { blogs: Array.isArray(posts) ? posts : [] });
     }

    return  res.render(this.path + 'index', { blogs: posts });
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
    async show(req, res, next) {
        let id = req.params.id.split('-')[0] ?? null;

        if (! id) {
          return res.redirect('not-found');
        }
        // let's get the post by id ...

       let post = await (new Blog()).findBy({id: id}, ['user']);

        // in case we don't have any post let's make early return ...
        if(! post.isLoaded()) {
            return res.redirect('not-found');
        }

       // let's get the comments for this blogs
       let postComments = await (new Comment()).findBy({post_id: post.getId()}, ['user']);

       // let's find the tags ...
        let postTags = await (new Tag()).findBy({post_id: post.getId()}, ['postTags']);

        if (Array.isArray(postComments)) {
            post.comments = post.recursiveComments(postComments)
        } else  {
            post.comments = [];
        }

        if (Array.isArray(postTags)) {
            post.tags = postTags
        } else  {
            post.tags = [];
        }

        // for now let's keep it like this untill we find better approach
        if (post.user.loaded) {
            let user = new User();
            user.setAttributes(post.user.attributes)
            post.user = user;
        }

        // return res.json( post.comments[0]['replies'][0]['user']['attributes']['is_admin'] === 1);
        // console.log(req.session[`posts_${id}_visits_counts`] || 1)

        // if (res.cookie(`posts::${id}.vis`)) {
        //     res.sess('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        // }
        // console.log(post);

        res.render(this.path + 'show', { blog: post , title: post.name, sidebarInfo: [] });
    }

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