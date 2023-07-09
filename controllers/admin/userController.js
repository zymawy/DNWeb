const User = require('../../models/user');


class UserController {
    /**
     * The constructor function sets the path property to 'admin/users/' and binds the index function to the current
     * instance.
     */
    constructor() {
        this.path = 'admin/users/';
        this.index = this.index.bind(this);
    }

    /**
     * The index function retrieves all users from the database and renders them in a view with the title "All Users".
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as the request headers, request method, request URL, and request body.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to control the response, such as setting headers, status code, and
     * sending data back to the client. In this case, the `res.render()` method
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     * @returns a response with the rendered view template 'index' and passing in the 'users' and 'title' variables as data
     * to be used in the view.
     */
    async index(req, res, next) {
        const users = await (new User()).findBy({}, [], [], {by: 'users.id', order: 'DESC'});

        return res.render(this.path + 'index', {users: users, title: 'All Users'});
    }

}

module.exports = new UserController();