const Blog = require('../../models/blog');
const Category = require('../../models/category');
const {validationResult} = require("express-validator");
const PostCategory = require("../../models/postCategory");
const {tr} = require("date-fns/locale");


class CategoryController {
    constructor() {
        this.path = 'admin/categories/';
        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }
    async index(req, res, next) {
        const categories = await (new Category()).findBy({}, [], [], {'by': 'categories.id', 'order': 'DESC'});

       return res.render(this.path + 'index', { categories: categories, title: 'All Categories' });
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
        const categoryId = req.params.id;
        let category = null;

        const title = req.body.title;

        console.log(title)
        if (categoryId) {
            category = await (new Category()).update({id: categoryId},{name: title }, {touchTimestamp: true, updating: true})
        } else {
            category = await (new Category()).create({name: title }, {touchTimestamp: true})
        }

        console.log(category)

        return res.status(201).json({ category })
    }

     create(req, res, next) {

        return res.render(this.path + 'create', {title: 'Create Category'});
    }

   async edit(req, res, next) {

       const category = await (new Category()).findBy({id : req.params.id })


       return res.render(this.path + 'create',{category, title:"Edit Category " + category.getTitle()});
    }

    async delete(req, res, next) {
        const { id } = req.params

        await (new Category()).delete({id : id })

        return res.status(200).json(id);
    }

}
module.exports = new CategoryController();