var passport = require("passport");
// var session = require('express-session');
var Request = require("request");
var User = require("../models/user.model");
var bcrypt = require("bcryptjs");


// GET Register
exports.get_register = function (req, res, next) {
  var messages = req.flash("error");
  res.render("account/register", {
    title: "Đăng kí tài khoản",
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
};

// POST Register
exports.post_register = passport.authenticate("local.register", {
  // successRedirect: '/account/information',
  badRequestMessage: "Bạn chưa điền đủ thông tin !",
  failureRedirect: "/account/register",
  failureFlash: true
});

// GET Profile
exports.get_profile = (req, res, next) => {
  res.render('account/user_information', {
    title: 'User Information',
  });
};

//UPDATE INFORMATION
exports.get_update_information = function (req, res, next) {
  var messages = req.flash('error');
  res.render('account/update_information', {
    csrfToken: req.csrfToken(),
    title: 'Update Information',
    messages: messages,
    hasErrors: messages.length > 0
  });
};

exports.post_update_information = function (req, res, next) {

  User.findById(req.params.id, function (err, user) {
    var first_name = req.body.first_name.trim();
    var last_name = req.body.last_name.trim();
    var username = req.body.username.trim();
    var dob = req.body.dob.trim();
    var email = req.body.email.trim();
    var addr = req.body.addr.trim();
    var password = req.body.password;
    var Npasswordcheck = req.body.txtNPassword;
    var Npassword = bcrypt.hashSync(req.body.txtNPassword, bcrypt.genSaltSync(8));
    var Cpassword = req.body.txtCPassword;
    if (err) {
      req.flash('error', 'No account found');
      return res.redirect(`/account/${req.params.id}/information/update`);
    }

    if (user) {
      var check = false;
      if (password && !Npasswordcheck && !Cpassword) {
        req.flash('error', 'Vui lòng nhập đầy đủ thông tin mật khẩu để cập nhật ! Nếu không hãy xóa thông tin mật khẩu cũ để tiếp tục!');
        check = true;
      }
      if (password && (!bcrypt.compareSync(password, user.local.password))) {
        req.flash('error', 'Xác nhận mật khẩu cũ không trùng khớp !');
        check = true;
      }

      if (Npasswordcheck !== Cpassword) {
        req.flash('error', 'Xác nhận mật khẩu mới không trùng khớp !');
        check = true;
      }
      if (check) {
        return res.redirect(`/account/${req.params.id}/information/update`);
      }

    }

    if (password && Npasswordcheck && Cpassword) {
      user.info.fname = first_name,
        user.info.lname = last_name,
        user.local.username = username,
        user.info.dob = dob,
        user.local.email = email,
        user.info.addr = addr,
        user.local.password = Npassword;
    }
    else if (!password && !Npasswordcheck && !Cpassword) {
      user.info.fname = first_name,
        user.info.lname = last_name,
        user.local.username = username,
        user.info.dob = dob,
        user.local.email = email,
        user.info.addr = addr
    }

    user.save((error, result) => {
      if (error) {
        req.flash('error', 'ERROR!');
        return res.redirect(`/account/${req.params.id}/information/update`);
      }

      return res.redirect(`/account/${req.params.id}/information`);
    })
  });
};
// GET Login
exports.get_login = function (req, res, next) {
  var messages = req.flash("error");
  res.render("account/login", {
    title: "Đăng nhập",
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
};

// POST Login
exports.post_login = passport.authenticate("local.login", {
  badRequestMessage: "Bạn chưa điền đủ thông tin !",
  failureRedirect: "/account/login",
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
  res.redirect("/account/login");
};

//Kiểm tra có phải là seller không ?
exports.isSeller = function (req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.local.permission >= 1) return next();
  }
  req.session.retUrl = req.originalUrl;
  if (!req.isAuthenticated()) res.redirect("/account/login");
  else res.redirect("/");
};

exports.notLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  req.session.retUrl = req.originalUrl;
  res.redirect("/account/information");
};

exports.recaptcha = (request, response, next) => {
  var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
  recaptcha_url += "secret=" + "6LdotcsUAAAAAJkkmp-3UA9mEANITR-OIbOzCguN" + "&";
  recaptcha_url += "response=" + request.body["g-recaptcha-response"] + "&";
  recaptcha_url += "remoteip=" + request.connection.remoteAddress;
  recaptcha_url += "remoteip=" + request.connection.remoteAddress;
  Request(recaptcha_url, function (error, resp, body) {
    body = JSON.parse(body);
    if (body.success !== undefined && !body.success) {
      request.flash('error', 'Vui lòng xác nhận reCAPTCHA !');
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
  res.redirect(req.session.retUrl || "/");
  delete req.session.retUrl;
};
