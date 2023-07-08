const Category = require("../models/category");
const helpers = require("../helpers/capitalize");
const CategoryMiddleware = async (req, res, next) => {

    const c = new Category();
    res.locals.categories = await c.findAll({}, ['*'], {order: 'sort', by: 'ASC'}); // limit: 6 can limit the categories

    next();
}

module.exports = { CategoryMiddleware }