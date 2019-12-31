var createError = require('http-errors');
var express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
var express = require('express');
// var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//db
var mongoose = require("mongoose");
const uri =
  "mongodb+srv://user:pw@cluster0-cjvpa.mongodb.net/AuctionWeb?retryWrites=true&w=majority";
mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(err) {
    if (err) console.log("MongoDB Connect Error: ", err);
    else {
      console.log("MongoDB Connect Successfull!");
    }
  }
);

const Category = require("./models/Category");
const User = require("./models/User");
const Product = require("./models/Product");
const Bid = require("./models/Bid");

var id = "5e09fcf39a99352394f22edf";

Category.find().exec((err, product) => {
  if (err) console.log(err);
  else {
    console.log(product[0].name, product[0].child_cat_name);
    Product.find().exec((err, db) => {
      console.log(db);
    });
  }
});

//routes
var indexRouter = require("./routes/index");
var cartRouter = require("./routes/cart");
var postRouter = require("./routes/post_product");
var productRouter = require("./routes/product");
var searchRouter = require("./routes/search");
var shopRouter = require("./routes/shop");
var infoRouter = require("./routes/user_information");
var admCategory_Router = require("./routes/admin/admin_category");
var admProduct_Router = require("./routes/admin/admin_product");
var admUser_Router = require("./routes/admin/admin_user");

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
// app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/cart', cartRouter);
app.use('/post_product', postRouter);
app.use('/product', productRouter);
app.use('/search', searchRouter);
app.use('/shop', shopRouter);
app.use('/user_information', infoRouter);
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
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
