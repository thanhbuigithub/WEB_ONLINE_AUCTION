var settings = require("../configs/settings");
const Category = require("../models/category.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Bid = require("../models/bid.model");
const moment = require("moment");

module.exports = app => {
  app.use(async function(req, res, next) {
    res.locals.settings = settings;
    res.locals.logged = req.isAuthenticated();
    res.locals.user = req.user;
    console.log(res.locals.user);
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
      //Vai trò
      var roles = ["Bidder", "Seller", "Admin"];
      var user = req.user;
      res.locals.user.role = roles[user.local.permission];
      //Điểm đánh giá
      if (res.locals.user.rate_point.sum == 0) {
        res.locals.user.isNew = true;
      } else {
        res.locals.user.isNew = false;
        res.locals.user.point = Math.round(
          (res.locals.user.rate_point.plus / res.locals.user.rate_point.sum) *
            100
        );
      }
      //Ngày sinh
      var dob = new Date(res.locals.user.info.dob);
      res.locals.user.info.dob_convert = moment(
        dob,
        "YYYY-MM-DD'T'HH:mm:ss.SSSZ"
      ).format("D/MM/YYYY");
    }
    //local db
    var users = await User.find().exec();
    var pros = await Product.instance.find({ isEnd: false }).exec();
    var cats = await Category.instance.find().exec();
    pros.forEach(element => {
      element.childcat_name = cats.find(
        obj => obj._id.$oid === element.cat_id.$oid
      ).childcat_name[element.childcat_pos].name;
    });
    res.locals.lcCategories = cats;
    res.locals.lcProducts = pros;
    res.locals.lcUsers = users;
    if (req.user) {
      res.locals.isSeller = req.user.local.permission == 1;
      res.locals.isAdmin = req.user.local.permission == 2;
    }

    next();
  });
};
