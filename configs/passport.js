var validator = require("express-validator");
var LocalStrategy = require("passport-local").Strategy;
// var moment = require("moment");
var settings = require("../configs/settings");
var User = require("../models/user.model");

var provider = null;

module.exports = function (passport) {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      var newUser = user.toObject();
      newUser["provider"] = provider;
      done(err, newUser);
    });
  });

  // Passport local account
  passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    passswordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    // Validator
    req.checkBody('first_name', 'Vui lòng điền First Name !').notEmpty();
    req.checkBody('last_name', 'Vui lòng điền Last Name !').notEmpty();
    req.checkBody('username', 'Vui lòng điền thông tin User Name !').notEmpty();
    req.checkBody('dob', 'Vui lòng điền thông tin ngày sinh !').notEmpty();
    req.checkBody('email', 'Vui lòng điền thông tin Email !').notEmpty().isEmail();
    req.checkBody('addr', 'Vui lòng điền thông tin địa chỉ !').notEmpty();
    req.checkBody('password', ('Vui lòng điền mật khẩu, phải ít nhât %d kí tự', settings.passwordLength)).notEmpty().isLength({
      min: settings.passwordLength
    });
    req.checkBody('password', 'Mật khẩu không trùng khớp, thử lại !').equals(req.body.raw_Comfirm);
    // req.checkBody('accept', 'Bạn phải chấp nhận các điều khoản của chúng tôi !').equals("1");

    var errors = req.validationErrors();
    if (errors) {
      var messages = [];
      errors.forEach(function (error) {
        messages.push(error.msg);
      });
      return done(null, false, req.flash('error', messages));
    }

    User.findOne({
      'local.email': email
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        if (user.validAccount(req.body.username)) return done(null, false, { message: 'Tên đăng nhập đã tồn tại, vui lòng thử với tên khác !' });
        return done(null, false, { message: 'Email đã tồn tại, vui lòng thử với tên khác !' });
      }

      // Create user
      var newUser = new User();

      // Save user
      newUser.info.fname = req.body.first_name;
      newUser.info.lname = req.body.last_name;
      newUser.local.email = req.body.email;
      newUser.info.dob = req.body.dob;
      newUser.info.addr = req.body.addr;
      newUser.local.username = req.body.username;
      newUser.local.password = newUser.encryptPassword(req.body.password);

      // Nếu yêu cầu kích hoạt tài khoản qua email thì trạng thái tài khoản là INACTIVE
      newUser.status = (settings.confirmRegister == 1) ? 'INACTIVE' : 'ACTIVE';

      // Save User
      newUser.save((err, result) => {
        if (err) {
          return done(err);
        }
        // Nếu yêu cầu kích hoạt tài khoản qua email thì chỉ đăng ký mà không tự động đăng nhập
        if (settings.confirmRegister == 1) {
          return done(null, newUser);
        }
        else {
          req.logIn(newUser, err => {
            provider = 'local';
            return done(err, newUser,{ message: 'Đăng kí thành công !' });
          })

        }
      });
    });

  }));

  // Passport Login
  passport.use('local.login', new LocalStrategy({
    usernameField: 'f_Username',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, username, password, done) {
    req.checkBody('f_Username', 'Tên đăng nhập không hợp lệ , thử lại !').notEmpty();
    req.checkBody('password', 'Mật khẩu không hợp lệ, thử lại !').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      var messages = [];
      errors.forEach(function (error) {
        messages.push(error.msg);
      });
      return done(null, false, req.flash('error', messages));
    }

    User.findOne({
      'local.username': username
    }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, {
          message: 'Tên đăng nhập không tìm thấy !'
        });
      }

      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Mật khẩu không đúng, thử lại !'
        });
      }

      if (user.isInActivated(user.status)) {
        return done(null, false, {
          message: 'Tài khoản của bạn chưa kích hoạt !'
        });
      }

      if (user.isSuspended(user.status)) {
        return done(null, false, {
          message: 'Tài khoản của bạn bị treo !'
        });
      }

      provider = "local";
      return done(null, user);

    });

  }));

}
