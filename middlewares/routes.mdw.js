//Router Main
var indexRouter = require("../routes/index");
var productRouter = require("../routes/product");
var searchRouter = require("../routes/search");
var shopRouter = require("../routes/shop");
var postProductRouter = require("../routes/post_product");
//Router Account
var account = require("../routes/account");
//Router Admin
var admin = require("../routes/admin.router");

module.exports = app => {
  app.use("/", indexRouter);
  app.use("/product", productRouter);
  app.use("/search", searchRouter);
  app.use("/shop", shopRouter);
  app.use("/account", account);
  app.use("/admin", admin);
  app.use("/post_product", postProductRouter);
};
