const express = require('express');
const categoryController = require('../../controllers/categoryController');
const Blog = require("../../models/blog");
const router = express.Router();

router.get('/categories/:category', async function (req, res, next) {
    let category = req.params?.category?.split('-')[0] ?? null;
    if (!category) {
        return res.redirect('/blogs/not-found');
    }
    let posts = await (new Blog()).searchBy({id: category});

    if (!Array.isArray(posts) && !posts.isLoaded()) {
        posts = []
        // return res.redirect('/blogs/not-found\'');
    }
    // console.log(posts)
    return res.render('categories/show', {blogs: Array.isArray(posts) ? posts : [posts]});
});
router.get('/tags/:tag', async function (req, res, next) {

    let tag = req.params?.tag?.split('-')[0] ?? null;

    if (!tag) {
        return res.redirect('/blogs/not-found');
    }

    // let's get the post by id ...
    let posts = await (new Blog()).searchBy({id: tag}, {type: 'tags'});

    if (!Array.isArray(posts) && !posts.isLoaded()) {
        posts = []
        // return res.redirect('/blogs/not-found\'');
    }
    console.log(posts)
    // in case we don't have any post let's make early return ...
    // if(! post.isLoaded()) {
    //     return res.redirect('not-found');
    // }
    return res.render('categories/show', {blogs: Array.isArray(posts) ? posts : [posts]});
});


module.exports = router;