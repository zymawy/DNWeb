### Commentary in PDF format

○ A high level schematic diagram for your website demonstrating all three tiers



# Extensions

## **Comment Moderation And Reply Comment**

---

### 1.1 **Comment** **Moderation**

                Manage and maintain quality of blog comments with this feature. Users may submit comments to the site and authors can approve or reject them. 

in the this file `views/blogs/show.ejs`

| ![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/comments-ejs.png) |
| ----------------------------------------------------------------------- |

The comment on a blog post might first appear as "Awaiting Approval" until the author approves it. Currently, other users cannot see the comment. only unpublished  comment be seen by the user owner, till been reviewed and done by author. Upon approval, the comment becomes "published" and is visible to all users. In the database schema, I use `publishd_at` as `timestamp` in order for me to track the date and time. the author approve the comment abd plus treat as flag of determination of the moderation!. 

| ![](/Users/zymawy/Library/Application%20Support/marktext/images/2023-07-04-08-31-35-image.png) |
| ---------------------------------------------------------------------------------------------- |

### 1.2 **Reply to Comment**

        Responding to comments adds depth to blog discussions. User comments can directly be responded to, creating a thread of related conversations!.

As an example,  Another user could reply directly to it instead of posting a separate, standalone comment or the Author can replay individual to each user in the same thread.

It promotes clear, organized discussions through its nested structure of comments and replies. Users can also interact directly with each other's comments, encouraging user interaction. in my implementation in **`Data Layer (Database)`**.  I added `parent_id` in my `comments` table, here is a sample diagram. in order to make this feature. 

| ![](/Users/zymawy/Library/Application%20Support/marktext/images/2023-07-04-09-02-36-image.png) |
| ---------------------------------------------------------------------------------------------- |

  where i'm updating the column if the comment is a replay comment. locating the `views/blogs/show.ejs`. in the `scrip` code from the **`Presentation Layer (Client Side)`**. I'm posting the comment content using `fetch` API, to make a **request/response data from a server**. here I'm gripping the data I needed in order to send it to the `server` and create comment/reply comment in the database. 

| ![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/comment-create-js.png) |
| ---------------------------------------------------------------------------- |

in this file `controllers/replyController.js`. the code in **`Application Layer (Server Side)`** is doing this job. see the code below.

| ![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/comment-create.png) |
| ------------------------------------------------------------------------- |

 **bulding the comments (recursive)**, in order to achieve this functionality. we need somehow to do `recursive` in each `comments` iterating over them and checking if the current `comment` has `parant_id` if it does that mean this comment is a reply comment for the id setted in the `parant_id`. so we will cansider it as replay (child) for the the comment. see code below. for more detail. the code could found in `models/blog.js` Model. 

![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/recursiveComments.png)

## **Pagination and Infinite Scroll**

    When you're browsing through a lot of articles, implement pagination or infinite scrolling to make it faster and easier. Reading articles becomes easier because they're broken down into manageable chunks. the way I implemented is by using vanilla javascript capabilities. Navigate into `views/blogs/index.ejs` in the `script` code. I'm simply listening for `scroll` event in the `window` element itself. this way I can keep track the movement of the user/visistor accross the page . In order to measure the height of my `posts-container` and grip the `containerHeight = offsetHeight` as well as `containerTop = offsetTop`, 

in order for me to determine if I need to make request to `server` I have to check to see if the `window.scrollY + window.innerHeight` is `greater or equal` to `containerHeight + containerTop` if the check matched. then, I will increase the `page` var and passing to load method in order to fetch the next page of the posts. 

see a minimal verstion of the code below. 

![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/pagination-scroll.png)

## **Search Functionality**

    Providing readers with a search feature that enables them to search for articles using keywords, tags, or categories would be helpful. In this way, there will be a greater chance that readers will be able to find interesting and relevant content as it is more discoverable. 

here in example for `autocomplete` functionality. 

![](/Users/zymawy/Library/Application%20Support/marktext/images/2023-07-05-05-40-01-image.png)



looking in `views/partials/nav.ejs`. I have set a `search` input wrrapped with a `dev` class. in the top of the page underneath the categories sections. is the blueprint of the html code. where it will be updated from the javascript code where we got a results from back end. 

![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/search-input-new.png)

 my plan was to make the amazing feature to be available in every page. so I decided to but the code in the `views/partials/footer.ejs` where it can be run in every page. 
 the way I implemented is to use `fetch` and `AbortController` a built in javascript API. 

![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/ongoingFetch.png)

it wil allow my to make a request to the `/blogs/query?q=${searchQuery}` where I can make a search in tables using `LIKE` keyword in database layer. here is the final query when hitting the search endpoint. 

 ![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/search-query.png)



## **User Authentication and Authorization**

 The purpose of this is to ensure that only authenticated and authorized users can perform certain actions. These actions include creating articles, deleting comments, or accessing user settings for authors/admins.

Commenting, and responding to user/reader comments. And the difference between `authors` and `reader/user`. Authors have the ability to create and edit content, while readers are limited to consuming content. This helps to ensure that only those who are allowed to do so are able to perform certain actions. It also helps to protect the content from being tampered with.

**Implementation**:

Using 'JWT' and `session/cookie` I was able to protect and authenticate users and protect their data. By using the machoism of the JWT, you can securely do so. lets diff deep into the code and explore it.

with the help of the `middleware` in `nodejs` I used to validate the tokens and determing the current user. see `middlewares/AuthenticateMiddleware.js` file



1. **validate data**

In the `controllers/auth/Login.js` controller. After validating the input using `express-validator` and ensuring the data are valid. 

![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/vaildor.png)

I used `bcrypt` to hash the user password and protect it.

![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/bcrypt.png)

 

This way I am making sure we save the sensitive data of our users/authors and we are not saving the password in plaintext even when the database has been leaked ensuring that the password is not compromised.

2. **creating the token once login/register**
   
   When we ensure our data is clean, we already store the data in the database. time to create the token in `jwt` we have a method called `sign` it took 3 arguments.
   
   1. `payload`
   
   2. `secretOrPiveteKey`
   
   3. `options`

  so the payload is the data you want to secure and pass it alongside with requests so you can verfie the user each time user make a request to the server.

  `secretKeyOrPriveteKey` is any string value you want to set this is the most important part of the `jwt` with this string secret key the `jwt` can verfiy the token when it come back from the user. later on we verfiy the `middlewares/AuthenticateMiddleware.js` . below the method that will create the `token` based in the id of the user passing it as payload to the `sgin` method in the `jwt`. 

    ![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/jwt.png)

this will generate token looks like this `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImlhdCI6MTY4ODI1NTgxNywiZXhwIjoxNjg4ODYwNjE3fQ.YmiM7Hkddupdn2exDIu4-tfe75HC-fAoPMG2xiIVBs4` each part of this string separated by `.` has it's own unique hashed data. 

here is a the full code when user register. Then, setting the `res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })` into `res.cookie` in order to vaildate the token later on in the middleware. 

![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/register.png)

 lastly, I already registered this `middlewares/AuthenticateMiddleware.js`  middlware in every middleware that need to be authenticate in order to proceed. every request will be pass through this middlerware. 

```javascript
const { requireAuth, checkUser} = require('../middlewares/AuthenticateMiddleware');

app.use('/admin/blogs', requireAuth,blogAdminRoutes);
```

### requireAuth

inside the `AuthenticateMiddleware` middleware I'm doing my magic work. as previously mentioned I was putting the generated `token` inside the `res.cookie` object. within the `requireAuth` method I `verify` the `jwt` cookie. once we have it in the cookie object. let's grep it then `verify` it. in case it's vaild no redirect happend but, once the `jwt` can't verify the token the system will automatically redirect the user to login page. in order for the user gain the authority. 

here is a full code below 

![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/verify.png)

### checkUser

    Likewise in `checkUser`  I got the `token` and `verify` it then decoded the `payload` afterwards I will check the payload id that I already set when registration/login step. then I will query the user in database in case the user has been deleted/dectivated or missing. if I found the user I set it in the `res.locals` so I can use it later on to show the user name and let the user comment,search and react to the posts.

![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/checkUser.png)

  

## **User Roles/Permissions**

    since we have 2 type of users each user has it's own capability and area of work. 

 `User Author` has different area of responsibility like managing (*CURD*) posts, posts comments, general settings ..etc, unlike the `Reader User` it can comment to posts, reply comment posts and react to posts. in case of application it's better to set some sort of roles for each individual user type. 

 **Implementation**: I have tweak my database users schema by adding `is_admin` column in it. 

![](/Users/zymawy/Library/Application%20Support/marktext/images/2023-07-05-08-08-54-image.png)

 this tweaked column will be treated as flag for determining the type of the user in case the user has `is_admin` with value of `1` that is indication of the `author/admin` user type. Likewise `is_admin` with value `0` it mean `reader/user` type. this approach will I allow my to differentiate between the 2 type and act accordingly. In my login page when user successfully log in. I'm using this flag to determine where the user should be redirected? case it's none admin it will be redirected to `/blogs` otherwise `/admin/blogs`. 

![](/Users/zymawy/Code/school/apr-2023/dnw/commentary/roles.png)



## **Social Sharing**

    Readers will be able to easily share articles throughout popular social media platforms by using the social sharing functionality within articles. My blog content can be viewed more widely and will have a greater chance of being seen by more people by doing this.

@todo 

insert image here after implementing 

## **Drafts and Scheduled Publishing**

  It is a wonderful feature to have post states. By using it, authors can direct posts and come back later to engage and continue the process. Thus, my first idea is to create a column for published_at in the posts table to make the features more functional. Instead of `varchar/text`, it is `DateTime/timestamp`. It is possible to determine if a post has not been published yet by adding another condition to the where clause, such as `where published_at is not null`. In addition, you can determine the date when the article was published. As a result, I will have more control and insight into how I should handle and use this functionality.

## **Responsive Design and Mobile Optimization**

## **Reactions for Articles (Emojis)**

# **Article Stats**

    Statistics about readers' visits to the article and their reading time. By doing so, you can gain insight into the popularity and engagement of your articles.

![](/Users/zymawy/Library/Application%20Support/marktext/images/2023-07-05-09-01-31-image.png)





# text editor



# **Tags for Articles**

    Provide a tag filter for readers so that authors can add tags to their articles. Authors can tag articles, and categorize and organize them according to certain topics or themes

# **Categories  for Articles**
