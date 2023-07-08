const Blog = require('../models/blog');
const Comment = require('../models/comment');
const Tag = require('../models/tag');
const User = require('../models/User');
var getUnixTime = require('date-fns/getUnixTime')


class ReplyController {
    constructor() {
        this.path = 'replies/';
        this.post = this.post.bind(this);
    }
    async post(req, res, next) {
        let {comment, reply_id} = req.body;
        let post_id = req.params.id;

        const CommentModel = new Comment()
        let data = {comment, user_id: res.locals.currentUser.getId(), post_id};
        if (reply_id) {
            data.parent_id = reply_id;
        }

        // in case it's admin let's published the comment direct
        if (res.locals.isAdmin) {
            data.published_at = getUnixTime(new Date());
        }

        CommentModel.create(data)
        return res.json({comment, reply_id})
    }

}
module.exports = new ReplyController();