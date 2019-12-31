var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');

//Config
var settings = require('./configs/settings');
var database = require('./configs/database');

//Router Main
var indexRouter = require('./routes/index');
var productRouter = require('./routes/product');
var searchRouter = require('./routes/search');
var shopRouter = require('./routes/shop');

//Router Account
var account = require('./routes/account');

//Router Admin
var admin = require('./routes/admin.router');

//Init app
var app = express();

/* Kết nối tới cơ sở dữ liệu */

mongoose.connect(database.dbStr, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', _ => {
  console.log('Database connected succesful !')
})

db.on('error', err => {
  console.error('Connection failed:', err)
})

// Models
const Category = require("./models/Category");
const User = require("./models/account");
const Product = require("./models/Product");
const Bid = require("./models/Bid");

// var id = "5e09fcf39a99352394f22edf";

// Category.find().exec((err, product) => {
//   if (err) console.log(err);
//   else {
//     console.log(product[0].name, product[0].child_cat_name);
//     Product.find().exec((err, db) => {
//       console.log(db);
//     });
//   }
// });



/* Khai báo để sử dụng kịch bản passport */
require('./configs/passport')(passport);

// view engine setup
app.engine('hbs', exphbs({
  defaultLayout: 'main.hbs',
  extname: '.hbs',
  layoutsDir: 'views/layouts',
  partialsDir: 'views/partials',
  helpers: {
    section: hbs_sections(),
  }
}));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

// log tất cả request ra console log
app.use(logger('dev'));
app.use(validator());
// BodyParser MiddleWare

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set static folder
app.use(express.static('public'));

/* Cấu hình passport */
app.use(session({
  secret: settings.secured_key,
  resave: false,
  saveUninitialized: false
}))
// ConnectFlash MiddleWare
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Set local
app.use(function (req, res, next) {
  res.locals.settings = settings;
  res.locals.logged = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

//
app.use('/', indexRouter);
app.use('/product', productRouter);
app.use('/search', searchRouter);
app.use('/shop', shopRouter);
//
app.use('/account', account);
//
app.use('/admin', admin);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
