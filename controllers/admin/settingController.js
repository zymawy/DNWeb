const Setting = require('../../models/generalSetting')
const Post = require('../../models/blog')
const {validationResult} = require("express-validator")
const DUMMY_DATA = require('../../db/seed/dummy_data.json');
const {parseISO, getUnixTime} = require("date-fns");

class SettingController {
    /**
     * The constructor function initializes the path variable and binds the index and store functions to the current
     * object.
     */
    constructor() {
        this.path = 'admin/settings/';

        this.index = this.index.bind(this);
        this.store = this.store.bind(this);
    }

    /**
     * The index function retrieves settings data and renders it in a view with a title.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as the request headers, query parameters, and request body.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It is
     * an instance of the Express `Response` class and provides methods for sending various types of responses, such as
     * rendering a view, sending JSON data, or redirecting to another URL.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used for error handling or to move on to the next middleware
     * function.
     * @returns a rendered view with the path 'index' and the variables 'settings' and 'title' passed to it.
     */
    async index(req, res, next) {
        const settings = await (new Setting()).findBy({}, [], [],);

        return res.render(this.path + 'index', {settings: settings, title: 'General Settings '});
    }

    /**
     * The function stores data from the request body, updates settings, and returns a response.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request
     * such as headers, body, and query parameters.
     * @param res - The `res` parameter is the response object that is used to send the response back to the client. It
     * contains methods and properties that allow you to control the response, such as setting the status code, sending
     * JSON data, or redirecting the client to another URL.
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when there is an error or when the current middleware
     * function has completed its task and wants to pass control to the next middleware function.
     * @returns a JSON response with the properties `title`, `keywords`, `author`, and `subtitle` if there are no
     * validation errors. If there are validation errors, it returns a JSON response with the validation errors.
     */
    async store(req, res, next) {
        const result = validationResult(req);
        /**
         * We have error return
         */
        if (result.isEmpty() === false) {
            return res.status(422).send({errors: result.array()});
        }

        const {title, keywords, author, subtitle} = req.body;
        const response = req.body;

        for (const [key, value] of Object.entries(response)) {
            await (new Setting()).update({'key': key}, {value}, {touchTimestamp: false})
        }

        return res.status(201).json({title, keywords, author, subtitle})
    }

    /**
     * The above function parses dummy data, creates posts using the data, and returns the length of the dummy data.
     * @param req - The `req` parameter is the request object, which contains information about the incoming HTTP request.
     * @param res - The `res` parameter is the response object that is used to send a response back to the client. It is
     * typically used to send JSON data, HTML, or other types of responses. In this code snippet, the `res` object is used
     * to send a JSON response with the length of the
     * @param next - The `next` parameter is a callback function that is used to pass control to the next middleware
     * function in the request-response cycle. It is typically used when you want to pass control to the next middleware
     * function after completing some asynchronous operation in the current middleware function.
     * @returns The length of the "dummy" array is being returned as a JSON response.
     */
    async dummy(req, res, next) {

        var dummy = JSON.parse(JSON.stringify(DUMMY_DATA));

        if (dummy) {
            dummy.forEach((data) => {
                (new Post()).create({
                    user_id: res.locals.currentUser.getId(),
                    title: data.title,
                    published_at:  getUnixTime(parseISO(data.publishedAt)),
                    'status': 'published',
                    description: "Since Node JS environment is a bit flexible in its design, you could have very well built your own ORM (Object Relational Mapping) to your own preferred database. But it’s a hassle and takes huge amounts of time to make, basically it’s not practical. In software engineering we’re told time and time again to not re-invent the wheel so here a tutorial on how to use Sequelize on Node JS app, and doing all that in Heroku production at the bottom. First of all let’s lay the groundwork, we’re using Node JS app (I use Express specifically) web framework. Sequelize is a promise-based ORM for most databases like MySQL, Postgres, SQLite, MariaDB, and Microsoft SQL Server. And for the database that I use here is Postgres. We’ll follow these steps that me and my team used in our Software Development Project course project.",
                    thumbnail: data.image,
                    subtitle: data.siteTwitter,
                    created_at: getUnixTime(parseISO(data.createdAt)),
                    read_visits: data.score,
                    updated_at: getUnixTime(parseISO(data.createdAt))
                });
            })
        }

        return res.json(dummy.length)
    }
}

module.exports = new SettingController();