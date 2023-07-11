const Tag = require('../../models/tag');
const {validationResult} = require("express-validator");


/* The TagController class is a JavaScript class that handles CRUD operations for tags, including retrieving all tags,
creating a new tag, editing an existing tag, and deleting a tag. */
class TagController {

    /**
     * The constructor function sets the initial values for the path and binds the index, create, edit, and delete methods
     * to the current object.
     */
    constructor() {
        this.path = 'admin/tags/';

        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }

    /**
     * The index function retrieves all tags from the database and renders them in a view with the title "All Tags".
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as the request headers, request method, request URL, and request body.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It is
     * an instance of the Express `Response` object.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     * @returns a response with the rendered view template 'index' and passing in the 'tags' and 'title' variables as data
     * to be used in the view.
     */
    async index(req, res, next) {
        let tags = await (new Tag()).findBy({}, [], [], {'by': 'tags.id', 'order': 'DESC'});
        tags = (! Array.isArray(tags) && typeof tags === 'object' && tags.isLoaded()) ? [tags] : tags;
        return res.render(this.path + 'index', {tags: tags, title: 'All Tags'});
    }

    /**
     * This JavaScript function stores a tag in a database, either by updating an existing tag or creating a new one, and
     * returns the stored tag as a JSON response.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as headers, body, and parameters.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to control the response, such as setting the status code, sending
     * JSON data, or redirecting the client to another URL.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     * @returns a response with a status code of 201 and a JSON object containing the "tag" variable.
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
        const tagId = req.params.id;
        let tag = null;

        const title = req.body.title;

        console.log(title)
        if (tagId) {
            tag = await (new Tag()).update({id: tagId}, {name: title}, {touchTimestamp: false, updating: true})
        } else {
            tag = await (new Tag()).create({name: title}, {touchTimestamp: false, updating: false})
        }

        console.log(tag)

        return res.status(201).json({tag})
    }

    /**
     * The create function renders a view for creating a tag with the title "Create Tag".
     * @param req - The `req` parameter is an object that represents the HTTP request made by the client. It contains
     * information such as the request method, request headers, request body, and request parameters.
     * @param res - The `res` parameter is the response object that is used to send a response back to the client. It
     * contains methods and properties that allow you to control the response, such as setting headers, sending data, and
     * redirecting the client to a different URL. In this case, the `res.render
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used to handle errors or to move on to the next middleware
     * function.
     * @returns a rendered view of the 'create' template, with the title set to 'Create Tag'.
     */
    create(req, res, next) {

        return res.render(this.path + 'create', {title: 'Create Tag'});
    }

    /**
     * The "edit" function renders a view for editing a tag with the specified ID.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as the request headers, request parameters, and request body.
     * @param res - The `res` parameter is the response object that represents the HTTP response that will be sent back to
     * the client. It is used to send the response data, such as the rendered HTML template in this case.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     * @returns a rendered view with the tag data and a title.
     */
    async edit(req, res, next) {

        const tag = await (new Tag()).findBy({id: req.params.id})


        return res.render(this.path + 'create', {tag, title: "Edit Tag " + tag.getTitle()});
    }

    /**
     * The above function deletes a tag with the specified ID and returns the ID in the response.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as headers, query parameters, and request body.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to control the response, such as setting the status code and sending
     * JSON data.
     * @param next - The `next` parameter is a function that is used to pass control to the next middleware function in the
     * request-response cycle. It is typically used for error handling or to move on to the next middleware function.
     * @returns The ID of the deleted tag is being returned as a JSON response.
     */
    async delete(req, res, next) {
        const {id} = req.params

        await (new Tag()).delete({id: id})

        return res.status(200).json(id);
    }

}

module.exports = new TagController();