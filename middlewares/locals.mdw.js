var settings = require("../configs/settings");
const Category = require("../models/category.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Bid = require("../models/bid.model");

module.exports = app => {
  app.use(async function(req, res, next) {
    res.locals.settings = settings;
    res.locals.logged = req.isAuthenticated();
    res.locals.user = req.user;

    //local db
    var pros = await Product.instance.find().exec();
    var cats = await Category.instance.find().exec();
    pros.forEach(element => {
      element.childcat_name = cats.find(
        obj => obj._id.$oid === element.cat_id.$oid
      ).childcat_name[element.childcat_pos].name;
    });
    res.locals.lcCategories = cats;
    res.locals.lcProducts = pros;

    next();
  });
};
