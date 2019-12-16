var createError = require('http-errors');
var express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var cartRouter = require('./routes/cart');
var postRouter = require('./routes/post_product');
var productRouter = require('./routes/product');
var searchRouter = require('./routes/search'); 
var shopRouter = require('./routes/shop');
var infoRouter = require('./routes/user_information');
var admCategory_Router = require('./routes/admin/admin_category');
var admProduct_Router = require('./routes/admin/admin_product');
var admUser_Router = require('./routes/admin/admin_user');

var app = express();

// view engine setup
app.engine('hbs', exphbs({
  defaultLayout: 'main.hbs',
  extname:'.hbs',
  layoutsDir: 'views/layouts',
  helpers: {
    section: hbs_sections(),
  }
}));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/cart', cartRouter);
app.use('/post', postRouter);
app.use('/product', productRouter);
app.use('/search', searchRouter);
app.use('/shop', shopRouter);
app.use('/user_info', infoRouter);
app.use('/admin_category', admCategory_Router);
app.use('/admin_product', admProduct_Router);
app.use('/admin_user', admUser_Router);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
