var createError = require("http-errors");
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var hbs_sections = require("express-handlebars-sections");
var mongoose = require("mongoose");
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");
var validator = require("express-validator");
var hbs = require("handlebars");

//Config
var settings = require("./configs/settings");
var database = require("./configs/database");

//MiddleWare
var locals = require("./middlewares/locals.mdw");
var routes = require("./middlewares/routes.mdw");

//Init app
var app = express();

/* Kết nối tới cơ sở dữ liệu */
mongoose.Promise = global.Promise;
mongoose.connect(
  database.dbStr,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  err => {
    if (err) console.log("Database connection failed, Error: ", err);
    else console.log("Database connected!");
  }
);

// Models
const Category = require("./models/category.model");
const User = require("./models/user.model");
const Product = require("./models/product.model");
const Bid = require("./models/bid.model");

// var id = "5e09fcf39a99352394f22edf";

// Category.instance.find().exec((err, product) => {
//   if (err) console.log(err);
//   else {
//     console.log(product[0].name, product[0]._id);
//     Product.instance.find().exec((err, db) => {
//       db.forEach(element => {
//         const cat = product.find(item => item._id.$oid === element.cat_id.$oid);
//         element.childcat_name = cat.childcat_name[element.childcat_pos].name;
//         console.log(element.childcat_name);
//       });
//       console.log(db);
//       console.log(db[0].childcat_name);
//     });
//   }
// });

hbs.registerHelper("json", function(context) {
  return JSON.stringify(context);
});

/* Khai báo để sử dụng kịch bản passport */
require("./configs/passport")(passport);

// view engine setup
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main.hbs",
    extname: ".hbs",
    layoutsDir: "views/layouts",
    partialsDir: "views/partials",
    helpers: {
      section: hbs_sections()
    }
  })
);

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "hbs");

// log tất cả request ra console log
app.use(logger("dev"));
app.use(validator());
// BodyParser MiddleWare

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set static folder
app.use(express.static("public"));

/* Cấu hình passport */
app.use(
  session({
    secret: settings.secured_key,
    resave: false,
    saveUninitialized: false
  })
);
// ConnectFlash MiddleWare
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Set local
locals(app);

//Set routes
routes(app);

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
