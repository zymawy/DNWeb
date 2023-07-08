const Blog = require('../../models/blog');
const Comment = require('../../models/comment');
const {getUnixTime} = require("date-fns");


class ReplyController {
    constructor() {
        this.path = 'admin/comments/';
        this.index = this.index.bind(this);
        this.approve = this.approve.bind(this);
    }
    async index(req, res, next) {
        const comments = await (new Comment()).findBy({}, ['user', 'post'], [], {by: 'comments.id', order: 'DESC'});

       return res.render(this.path + 'index', { comments: comments, title: 'All Comments' });
    }

    async approve(req, res, next) {
        const id = req.params.comment

        const c = await (new Comment()).update({id: id}, {'published_at':  getUnixTime(new Date())}, {touchTimestamp: true, updating: true })
        console.log(id)

        return res.json(c);
    }

}
module.exports = new ReplyController();