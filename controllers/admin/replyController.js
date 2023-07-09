const Comment = require('../../models/comment');
const {getUnixTime} = require("date-fns");

/* The ReplyController class handles the rendering of comments and updating the published_at field of a comment. */
class ReplyController {

    /**
     * The constructor function initializes the path property and binds the index and approve methods to the current
     * instance.
     */
    constructor() {
        this.path = 'admin/comments/';
        this.index = this.index.bind(this);
        this.approve = this.approve.bind(this);
    }

    /**
     * The index function retrieves all comments from the database and renders them in a view with the title "All
     * Comments".
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * from the client. It includes details such as the request method, URL, headers, and body.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It is
     * an instance of the Express `Response` object and provides methods for sending the response, such as `res.render()`
     * in this case.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     * @returns a response with a rendered view. The view being rendered is specified by the path 'index' and the data
     * being passed to the view includes the comments and a title.
     */
    async index(req, res, next) {
        const comments = await (new Comment()).findBy({}, ['user', 'post'], [], {by: 'comments.id', order: 'DESC'});

       return res.render(this.path + 'index', { comments: comments, title: 'All Comments' });
    }

    /**
     * The `approve` function updates the `published_at` field of a comment with the current timestamp and returns the
     * updated comment.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request,
     * such as the request headers, request parameters, and request body.
     * @param res - The `res` parameter is the response object that is used to send a response back to the client. It
     * contains methods and properties that allow you to control the response, such as `res.json()` which is used to send a
     * JSON response.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when you want to pass control to the next middleware
     * function after completing some asynchronous operation in the current middleware function.
     * @returns a JSON response containing the updated comment object.
     */
    async approve(req, res, next) {
        const id = req.params.comment

        const c = await (new Comment()).update({id: id}, {'published_at':  getUnixTime(new Date())}, {touchTimestamp: true, updating: true })
        console.log(id)

        return res.json(c);
    }

}

module.exports = new ReplyController();