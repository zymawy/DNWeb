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
    app.use('/admin/settings', requireAuth, validateAuth, settingAdminRoutes);
    app.use('', generalRoutes);
    app.get("/admin", requireAuth, validateAuth, function (req, res) {
        res.redirect('/admin/blogs')
    });
    app.use('/blogs', blogRoutes);

    app.use('/auth', validateAuth, authRoutes);

    app.get("/", function (req, res) {
        res.redirect('/blogs')
    });
};