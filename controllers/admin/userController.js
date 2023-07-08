const Blog = require('../../models/blog');
const User = require('../../models/user');


class UserController {
    constructor() {
        this.path = 'admin/users/';
        this.index = this.index.bind(this);
    }
    async index(req, res, next) {
        const users = await (new User()).findBy({}, [], [], {by: 'users.id', order: 'DESC'});

       return res.render(this.path + 'index', { users: users, title: 'All Users' });
    }

}
module.exports = new UserController();