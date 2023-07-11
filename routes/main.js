const blogRoutes = require('./blogs/main');
const generalRoutes = require('./blogs/generalMain');
const blogAdminRoutes = require('./blogs/admin');
const categoryAdminRoutes = require('./blogs/categoryAdmin');
const tagAdminRoutes = require('./blogs/tagAdmin');
const settingAdminRoutes = require('./blogs/settingAdmin');
const authRoutes = require('./auth/main');
const {requireAuth, checkUser, validateAuth} = require('../middlewares/AuthenticateMiddleware');
const {ShareGeneralSettings} = require('../middlewares/SeoMiddleware');
const {HelpersMiddleware} = require('../middlewares/HelpersMiddleware');
const {CategoryMiddleware} = require('../middlewares/CategoryMiddleware');
module.exports = (app) => {
    // we can add global middleware and share the requires info we need across the tool!
    app.use('*', [HelpersMiddleware, checkUser, ShareGeneralSettings, CategoryMiddleware]);

    // let's cover any unexpected error to this page.. :)
    app.get("/blogs/not-found", (req, res) => res.render('woops'));
    app.get("/not-found", (req, res) => res.render('woops'));

    app.use('/admin/categories', requireAuth, validateAuth, categoryAdminRoutes);
    app.use('/admin/tags', requireAuth, validateAuth, tagAdminRoutes);
    app.use('/admin/blogs', requireAuth, validateAuth, blogAdminRoutes);

    /* handle `generalRoutes` */
    app.use('/admin/settings', requireAuth, validateAuth, settingAdminRoutes);

    /* handle `generalRoutes` */
    app.use('', generalRoutes);

    /* in root admin path, instructing it to navigate to the specified URL ("/admin/blogs" in this case). */
    app.get("/admin", requireAuth, validateAuth, function (req, res) {
        res.redirect('/admin/blogs')
    });

    /* setting up a route for handling requests to the '/blogs' endpoint. It is using
    the `blogRoutes` module to handle these requests. This means that any request to '/blogs' will be passed to the
    `blogRoutes` module for further processing. */
    app.use('/blogs', blogRoutes);

    /* setting up a route for handling requests to the '/auth' endpoint.
    It is using the `validateAuth` middleware function to authenticate the user before processing the request. If the
    user is authenticated, the request will be passed to the `authRoutes` module for further processing. */
    app.use('/auth', validateAuth, authRoutes);

    /* in root path, instructing it to navigate to the specified URL ("/blogs" in this case). */
    app.get("/", function (req, res) {
        res.redirect('/blogs')
    });
};