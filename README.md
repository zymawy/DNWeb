<h1 align="center">CM2040 Database Networks and the Web</h1>

<h3 align="center">Blogging Tools</h3>

<h6 align="center"><b>By:</b> Hamza Zymawy</h6>

## Overview

This application meets all the requirements for this course's midterm assignment. I built the application using **Node.js**, along with **Expressjs** as a server-side middleware framework and **EJS** for templating. The data layer is provided by a **SQLlite3** database.

Based on the Tailwind Css framework, the user interface provides a richer user experience with forms with validation, error and success messages.

To cover multiple use cases, HTML source files were reused where possible. For example, the same source file was used for both adding and updating posts, adapting copy dynamically as provided by the middleware.



#### Installation requirements

* NodeJS   
  - follow the install instructions at https://nodejs.org/en/  
  - we recommend using the latest LTS version  
* Sqlite3   
  - Windows users: follow instructions here https://www.sqlitetutorial.net/download-install-sqlite/  
  - Mac users: it comes preinstalled  
  - Linux users: use a package manager eg. apt install  





### Directory structure

```shell
|__ root
    |__ package.json
    |__ controllers
        |__ admin
            |__ blogController.js
            |__ categoryController.js
            |__ replyController.js
            |__ settingController.js
            |__ tagController.js
            |__ categoryController.js
            |__ userController.js
        |__ auth
            |__ Login.js
        |__ blogController.js
        |__ categoryController.js
        |__ replyController.js
    |__ db
        |__ seed
            |__ dummy_data.json
        |__ blogs.db
        |__ db_schema.sql
    |__ helpers
        |__ capitalize.js
    |__ middlewares
        |__ AuthenticateMiddleware.js
        |__ CategoryMiddleware.js
        |__ HelpersMiddleware.js
        |__ SeoMiddleware.js
    |__ models
        |__ baseModel.js
        |__ blog.js
        |__ category.js
        |__ comment.js
        |__ generalSetting.js
        |__ postCategory.js
        |__ postTag.js
        |__ seo.js
        |__ tag.js
        |__ user.js
    |__ public
        |__ scripts
            |__ quill.js
        |__ styles
            |__ quill.snow.css
            |__ style.css
            |__ tailwind.css
        |__ uploads
            |__ .gitignore
    |__ views
        |__ auth
            |__ main.js
        |__ blogs
            |__ admin.js
            |__ categoryAdmin.js
            |__ generalMain.js
            |__ main.js
            |__ settingAdmin.js
            |__ tagAdmin.js
        |__ main.js
    |__ views
        |__ admin
            |__ blogs
                |__ create.ejs
                |__ index.ejs
            |__ categories
                |__ create.ejs
                |__ index.ejs
            |__ comments
                |__ index.ejs
            |__ partials
                |__ header.ejs
                |__ footer.ejs
                |__ nav.ejs
                |__ sidebar.ejs
            |__ settings
                |__ index.ejs
            |__ tags
                |__ create.ejs
                |__ index.ejs
            |__ users
                |__ index.ejs
        |__ auth
            |__ blogs.ejs
            |__ register.ejs
        |__ blogs
            |__ login.ejs
            |__ index.ejs
            |__ maybeYouLike.ejs
            |__ show.ejs
        |__ categories
            |__ show.ejs
        |__ partials
            |__ header.ejs
            |__ footer.ejs
            |__ menunav.ejs
            |__ nav.ejs
            |__ sidebar.ejs
            |__ topbarnav.ejs
        |__ woops.ejs
    |__ .env.example
    |__ .gitignore
    |__ database.js
    |__ index.js
    |__ package.json
    |__ postcss.config.js
    |__ README.md
    |__ tailwind.config.js
    |__ yarn.lock
```

## Getting Started

    here a pre step in how to install and run the project:

1. run `npm install` from the project directory

2. run `cp .env.example .env` to copy the default .env values

3. change the **.env** value till it meet your configuration 
   
   1. `DB_HOST` the host name default `localhost`
   
   2. `DB_USER` user name of the database default `root`
   
   3. `DB_PASS` password of the database default `root`
   
   4. `DB_NAME` the name of the database default `blogs`
   
   5. `JWT_SECRET_KEY` the secret key of JWT to decode/encode tokens
   6. `ENABLE_QUERY_DEBUG` enable this flag allows you to see all the queries that being run in the console. (:

4. run `npm run build-db` to create database in `/db/blogs.sql`
5. run `npm run tailwind:css` to republish the tailwind component (Optional)

6. run `npm run start` to start serving the web app



## Highlights

in case you want a quick creation of posts to test upen. already setup an admin user.

1. Navigate to login page via `/auth/login` and login using credentials email `admin@admin.com` and password `password` . this will gain you access to admin/auther area 

2. Navigate to settings page `/admin/settings`

![](/Users/zymawy/Library/Application%20Support/marktext/images/2023-07-11-05-30-37-image.png)

in the settings page their will be a button `seed dummy data` this action will try to fill a dummy/fake data into the database. 

![](/Users/zymawy/Library/Application%20Support/marktext/images/2023-07-11-05-31-43-image.png)

afterwords, will see some posts has been added and showing up at the reader page as will as admin posts page. 



all others information being addressed in commentary file. 

thank you, 
