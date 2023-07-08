
const Tag = require('../../models/tag');
const {validationResult} = require("express-validator");


class TagController {
    constructor() {
        this.path = 'admin/tags/';

        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }
    async index(req, res, next) {
        const tags = await (new Tag()).findBy({}, [], [], {'by': 'tags.id', 'order': 'DESC'});

       return res.render(this.path + 'index', { tags: tags, title: 'All Tags' });
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
        const tagId = req.params.id;
        let tag = null;

        const title = req.body.title;

        console.log(title)
        if (tagId) {
            tag = await (new Tag()).update({id: tagId},{name: title }, {touchTimestamp: false, updating: true})
        } else {
            tag = await (new Tag()).create({name: title }, {touchTimestamp: false, updating: false})
        }

        console.log(tag)

        return res.status(201).json({ tag })
    }

     create(req, res, next) {

        return res.render(this.path + 'create', {title: 'Create Tag'});
    }

   async edit(req, res, next) {

       const tag = await (new Tag()).findBy({id : req.params.id })


       return res.render(this.path + 'create',{tag, title:"Edit Tag " + tag.getTitle()});
    }

    async delete(req, res, next) {
        const { id } = req.params

        await (new Tag()).delete({id : id })

        return res.status(200).json(id);
    }

}
module.exports = new TagController();