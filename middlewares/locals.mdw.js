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
    if (res.locals.logged) {
      res.locals.user.bids_count = 0;
      res.locals.user.bids_pro_id = [];
      var bids = await Bid.instance.find({ user_id: req.user._id }).exec();
      for (var i = 0; i < bids.length; i++) {
        var pro = await Product.instance.findById(bids[i].pro_id).exec();
        if (!pro.isEnd) {
          res.locals.user.bids_count++;
          res.locals.user.bids_pro_id.push(pro._id);
        }
      }
    }
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
    if (req.user) {
      res.locals.isSeller = req.user.local.permission == 1;
      res.locals.isAdmin = req.user.local.permission == 2;
    }

    next();
  });
};
