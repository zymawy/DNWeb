const Category = require("../models/category");
const helpers = require("../helpers/capitalize");
const CategoryMiddleware = async (req, res, next) => {

    const c = new Category();

    const categories = await c.findAll({}, ['*'], {order: 'sort', by: 'ASC', limit: 2});
    res.locals.categories = categories;

    next();
}

module.exports = { CategoryMiddleware }