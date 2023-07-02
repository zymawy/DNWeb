const BaseModel = require('../models/baseModel');
const {th} = require("date-fns/locale");
const {capitalizeString} = require("../helpers/capitalize");
// const Post = require('./blog')
class User extends BaseModel {
    constructor() {

        super('users', {}, {
            'id': null,
            'full_name': null,
            'email': null,
            'password': null,
            'is_admin': null,
            'bio': null
        });

        this.table = 'users';

        // Define the relations
        // this.relations = {
        //     'post': {
        //         type: 'hasMany',
        //         model: Post
        //     }
        // };

        // this.relations = {
        //     get post() {
        //         const Post = require('./blog'); // Import the Post class here
        //         return {
        //             type: 'hasMany',
        //             model: new Post() // Initialize an instance of the Post model when accessed
        //         };
        //     }
        // };

    }

    getFullName() {

        return capitalizeString(this.attributes.full_name);
    }

    getId() {
        return this.attributes.id;
    }
    getEmail() {

        return this.attributes.email;
    }

    getIsAdmin() {

        return this.attributes.is_admin;
    }

    getThumbnail() {

        return this.attributes.thumbnail || 'https://source.unsplash.com/collection/1346951/150x150?sig=1'
    }

    getBio () {
        return this.attributes.bio || 'About Me, Im Writer !'
    }
}


module.exports = User;