const Comment = require('../models/comment');
var getUnixTime = require('date-fns/getUnixTime')
const {validationResult} = require("express-validator");


class ReplyController {

    /**
     * The constructor function sets the initial path for replies and binds the post function to the current object.
     */
    constructor() {
        this.path = 'replies/';
        this.post = this.post.bind(this);
    }

    /**
     * This function handles the creation of a comment on a post, including the option to reply to an existing comment.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as headers, query parameters, and the request body.
     * @param res - The `res` parameter is the response object that is used to send a response back to the client. It
     * contains methods and properties that allow you to manipulate the response, such as `res.json()` which is used to
     * send a JSON response.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used for error handling or to move on to the next middleware
     * function in the chain.
     * @returns a JSON response with the properties "comment" and "reply_id".
     */
    async post(req, res, next) {

        const result = validationResult(req);
        /**
         * We have va;datpom error
         */
        if (result.isEmpty() === false) {
            return res.status(422).send({errors: result.array()});
        }

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