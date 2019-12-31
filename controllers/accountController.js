var passport = require('passport');
var session = require('express-session');
// GET Register
exports.get_register = function (req, res, next) {
    var messages = req.flash('error');
    res.render('account/register', {
        title: 'Đăng kí tài khoản',
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
};

// POST Register
exports.post_register = passport.authenticate('local.register', {
    // successRedirect: '/account/information',
    failureRedirect: '/account/register',
    failureFlash: true
});

// GET Profile
exports.get_profile = function (req, res, next) {
    res.render('account/user_information', {
        title: 'User Information'
    });
};

// GET Login
exports.get_login = function (req, res, next) {
    var messages = req.flash('error');
    res.render('account/login', {
        title: 'Đăng nhập',
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
};

// POST Login
exports.post_login = passport.authenticate('local.login', {
    // successRedirect: '/',
    failureRedirect: '/account/login',
    failureFlash: true
});

// LOGOUT
exports.get_logout = function (req, res, next) {
    req.logout();
    res.redirect(req.headers.referer);
};
//Kiểm tra có đăng nhập chưa ?
exports.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.retUrl = req.originalUrl;
    res.redirect('/account/login');
};

exports.notLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.session.retUrl = req.originalUrl;
    res.redirect('/account/information');
};


exports.notLogin_use = function (req, res, next) {
    next();
};

// District
exports.restrict = (req, res) => {
    res.redirect(req.session.retUrl || '/');
    delete req.session.retUrl;
};