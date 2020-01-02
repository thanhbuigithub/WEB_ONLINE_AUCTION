var passport = require('passport');
// var session = require('express-session');
var Request = require("request");

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
    badRequestMessage: 'Bạn chưa điền đủ thông tin !',
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


exports.recaptcha = async(request, response, next) => {
        
    if(!request.body.recaptcha)
    {
        
        
        // return response.json({"msg":"Please select recaptcha !"});
    }
    var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + "6LdotcsUAAAAAJkkmp-3UA9mEANITR-OIbOzCguN" + "&";
    recaptcha_url += "response=" + request.body["g-recaptcha-response"] + "&";
    recaptcha_url += "remoteip=" + request.connection.remoteAddress;
    recaptcha_url += "remoteip=" + request.connection.remoteAddress;
    Request(recaptcha_url, function (error, resp, body) {
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) {
            response.redirect('/account/register');
        }
        else {
            next();
        }

    });
};

exports.notLogin_use = function (req, res, next) {
    next();
};

// District to previous page
exports.restrict = (req, res) => {
    res.redirect(req.session.retUrl || '/');
    delete req.session.retUrl;
};