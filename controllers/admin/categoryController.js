const Category = require('../../models/category');
const {validationResult} = require("express-validator");

/* The CategoryController class is responsible for handling CRUD operations for categories, including retrieving all
categories, creating a new category, editing an existing category, and deleting a category. */
class CategoryController {
    /**
     * The constructor function initializes the path and binds the index, create, edit, and delete methods to the current
     * object.
     */
    constructor() {
        this.path = 'admin/categories/';
        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }

    /**
     * The index function retrieves all categories from the database and renders them in a view with the title "All
     * Categories".
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request.
     * @param res - The `res` parameter is the response object that is used to send a response back to the client. It is an
     * instance of the `http.ServerResponse` class in Node.js.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     * @returns a response with the rendered view template 'index' and passing the categories and title as data to be used
     * in the view.
     */
    async index(req, res, next) {
        const categories = await (new Category()).findBy({}, [], [], {'by': 'categories.id', 'order': 'DESC'});

        return res.render(this.path + 'index', {categories: categories, title: 'All Categories'});
    }

    /**
     * This function stores a category in a database, either by updating an existing category or creating a new one, and
     * returns the stored category as a JSON response.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as headers, body, and parameters.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to control the response, such as setting the status code, sending
     * JSON data, or redirecting the client to another URL.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     * @returns a response with a status code of 201 and a JSON object containing the category.
     */
    async store(req, res, next) {
        const result = validationResult(req);
        /**
         * We have va;datpom error
         */
        if (result.isEmpty() === false) {
            return res.status(422).send({errors: result.array()});
        }

        // in case it's update case
        const categoryId = req.params.id;
        let category = null;

        const title = req.body.title;

        console.log(title)
        if (categoryId) {
            category = await (new Category()).update({id: categoryId}, {name: title}, {
                touchTimestamp: true,
                updating: true
            })
        } else {
            category = await (new Category()).create({name: title}, {touchTimestamp: true})
        }

        console.log(category)

        return res.status(201).json({category})
    }

    /**
     * The create function renders a view for creating a category with the title "Create Category".
     * @param req - The req parameter is the request object, which contains information about the incoming HTTP request
     * from the client. It includes data such as the request headers, request body, request method, and request URL.
     * @param res - The `res` parameter is the response object that is used to send a response back to the client. It
     * contains methods and properties that allow you to control the response, such as setting headers, sending data, and
     * redirecting the client to a different URL. In this case, the `res.render
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used to handle errors or to move on to the next middleware
     * function.
     * @returns a rendered view of the 'create' template, with the title set to 'Create Category'.
     */
    create(req, res, next) {

        return res.render(this.path + 'create', {title: 'Create Category'});
    }

    /**
     * The "edit" function renders a view for editing a category with the given ID.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as the request headers, request parameters, and request body.
     * @param res - The `res` parameter is the response object that represents the HTTP response that will be sent back to
     * the client. It is used to send the response data, such as the rendered HTML template in this case.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when you want to pass control to the next middleware
     * function after completing some asynchronous operation in the current middleware function.
     * @returns a rendered view with the category data and a title.
     */
    async edit(req, res, next) {

        const category = await (new Category()).findBy({id: req.params.id})


        return res.render(this.path + 'create', {category, title: "Edit Category " + category.getTitle()});
    }

    /**
     * The above function deletes a category with the specified ID and returns the deleted ID in the response.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as headers, query parameters, and request body.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to control the response, such as setting the status code and sending
     * JSON data.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used for error handling or to move on to the next middleware
     * function.
     * @returns The ID of the deleted category is being returned as a JSON response with a status code of 200.
     */
    async delete(req, res, next) {
        const {id} = req.params

        await (new Category()).delete({id: id})

        return res.status(200).json(id);
    }

}

module.exports = new CategoryController();