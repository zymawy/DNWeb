const BaseModel = require('../models/baseModel');
const {capitalizeString} = require("../helpers/capitalize");

/* The code is defining a JavaScript class called "User" that extends a base model class called "BaseModel". The User class
represents a user object and contains various methods for accessing and manipulating user data. */
class User extends BaseModel {
    /**
     * This is a constructor function for a User class in JavaScript that initializes the properties and relations of a
     * user object.
     */
    constructor() {

        super('users', {}, {
            'id': null,
            'full_name': null,
            'email': null,
            'password': null,
            'is_admin': null,
            'bio': null,
            'created_at': null,
            'updated_at': null,
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

    /**
     * The getFullName function returns the capitalized version of the full name attribute.
     * @returns the capitalized version of the full name.
     */
    getFullName() {

        return capitalizeString(this.attributes.full_name);
    }

    /**
     * The function returns the role of a user based on whether they are an admin or not.
     * @returns The role of the user. If the user is an admin, 'Admin' is returned. Otherwise, 'User' is returned.
     */
    getRole() {
        return this.getIsAdmin() ? 'Admin' : 'User';
    }

    /**
     * The function returns a boolean value indicating whether the user is an admin or not.
     * @returns a boolean value, which is determined by the value of the "is_admin" attribute.
     */
    getIsAdmin() {
        return Boolean(this.attributes.is_admin);
    }

    /**
     * The function returns the value of the "id" attribute.
     * @returns The value of the "id" attribute.
     */
    getId() {
        return this.attributes.id;
    }

    /**
     * The getEmail() function returns the email attribute of an object.
     * @returns The email attribute.
     */
    getEmail() {

        return this.attributes.email;
    }

    /**
     * The getThumbnail function returns the thumbnail attribute of an object, or a default image URL if the attribute is
     * not present.
     * @returns the value of `this.attributes.thumbnail` if it exists, otherwise it is returning the default URL
     * `'https://source.unsplash.com/collection/1346951/150x150?sig=1'`.
     */
    getThumbnail() {

        return this.attributes.thumbnail || 'https://source.unsplash.com/collection/1346951/150x150?sig=1'
    }

    /**
     * The getBio function returns the bio attribute of an object, or a default value if the bio attribute is not defined.
     * @returns the value of the `bio` attribute if it exists, otherwise it is returning the string "About Me, Im Writer
     * !".
     */
    getBio() {
        return this.attributes.bio || 'About Me, Im Writer !'
    }
}


module.exports = User;