const blogRoutes = require('./blogs/main');
const blogAdminRoutes = require('./blogs/admin');
const authRoutes = require('./auth/main');
const { requireAuth, checkUser} = require('../middlewares/AuthenticateMiddleware');
const {  ShareGeneralSettings } = require('../middlewares/SeoMiddleware');
const {  HelpersMiddleware } = require('../middlewares/HelpersMiddleware');
const {  CategoryMiddleware } = require('../middlewares/CategoryMiddleware');
module.exports = (app) => {
    // we can add global middleware and share the requires info we need across the tool!
    app.use('*', [HelpersMiddleware, checkUser, ShareGeneralSettings]);

    app.get("/blogs/not-found", function (req, res) {
        res.render('woops')
    });

    app.use('/admin/blogs', requireAuth,blogAdminRoutes);

    app.use('/blogs', CategoryMiddleware,blogRoutes);

    app.use('/auth', authRoutes);

    app.get("/", function (req, res) {
        res.redirect('/blogs')
    });
};