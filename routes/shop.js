var express = require("express");
var moment = require("moment");
var router = express.Router();
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Category = require("../models/category.model");
/* GET shop page. */

const perPage = 10;

// router.get("/all", async function(req, res, next) {
//   var pros = await Product.instance
//     .find()
//     .limit(10)
//     .sort({ submit_date: -1 })
//     .exec();
//   Product.addInfo(pros, res.locals.lcCategories, res.locals.lcUsers);
//   //Số trang
//   var all_pros_count = res.locals.lcProducts.length;
//   var pages_count;
//   if (all_pros_count % 10 == 0) pages_count = all_pros_count / 10;
//   else pages_count = all_pros_count / 10 + 1;
//   //Trang hiện tại
//   var curPage = 1;
//   res.render("shop", {
//     title: "Shop Page",
//     products: pros,
//     cur_page: curPage,
//     next_page: curPage + 1,
//     pre_page: curPage - 1,
//     pros_count: all_pros_count,
//     is_not_last_page: curPage != pages_count,
//     is_not_first_page: curPage != 1
//   });
// });

router.get("/all/:page", async function(req, res, next) {
  var page = parseInt(req.params.page);
  var pros = await Product.instance
    .find({ isEnd: false })
    .skip(perPage * (page - 1))
    .limit(perPage)
    .sort({ submit_date: -1 })
    .exec();
  Product.addInfo(pros, res.locals.lcCategories, res.locals.lcUsers);
  //Số trang
  var all_pros_count = res.locals.lcProducts.length;
  var pages_count;
  if (all_pros_count % 10 == 0) pages_count = all_pros_count / 10;
  else pages_count = all_pros_count / 10 + 1;
  //Trang hiện tại
  var curPage = page;
  res.render("shop", {
    title: "Shop Page",
    products: pros,
    cur_page: curPage,
    next_page: curPage + 1,
    pre_page: curPage - 1,
    pros_count: all_pros_count,
    is_not_last_page: curPage != pages_count,
    is_not_first_page: curPage != 1
  });
});

router.get("/:catid/:page", async function(req, res, next) {
  var page = parseInt(req.params.page);
  var catid = req.params.catid;
  var cat = await Category.instance.findById(catid).exec();
  var pros_to_count = await Product.instance
    .find({ cat_id: catid, isEnd: false })
    .exec();
  var pros = await Product.instance
    .find({ cat_id: catid, isEnd: false })
    .skip(perPage * (page - 1))
    .limit(perPage)
    .sort({ submit_date: -1 })
    .exec();
  Product.addInfo(pros, res.locals.lcCategories, res.locals.lcUsers);
  //Số trang
  var all_pros_count = pros_to_count.length;
  var pages_count;
  if (all_pros_count % 10 == 0) pages_count = all_pros_count / 10;
  else pages_count = all_pros_count / 10 + 1;
  //Trang hiện tại
  var curPage = page;
  res.render("shop", {
    title: "Category Page",
    products: pros,
    cur_page: curPage,
    next_page: curPage + 1,
    pre_page: curPage - 1,
    pros_count: all_pros_count,
    is_not_last_page: curPage != pages_count,
    is_not_first_page: curPage != 1,
    cat_name: cat.name
  });
});

router.get("/:catid/:childcatpos/:page", async function(req, res, next) {
  var page = parseInt(req.params.page);
  var catid = req.params.catid;
  var childcatpos = req.params.childcatpos;
  var cat = await Category.instance.findById(catid).exec();
  var childcat = cat.childcat_name[childcatpos];
  var pros_to_count = await Product.instance
    .find({ cat_id: catid, childcat_pos: childcatpos, isEnd: false })
    .exec();
  var pros = await Product.instance
    .find({ cat_id: catid, childcat_pos: childcatpos, isEnd: false })
    .skip(perPage * (page - 1))
    .limit(perPage)
    .sort({ submit_date: -1 })
    .exec();
  Product.addInfo(pros, res.locals.lcCategories, res.locals.lcUsers);
  //Số trang
  var all_pros_count = pros_to_count.length;
  var pages_count = Math.ceil(all_pros_count / 10);
  //Trang hiện tại
  var curPage = page;
  res.render("shop", {
    title: "Category Page",
    products: pros,
    cur_page: curPage,
    next_page: curPage + 1,
    pre_page: curPage - 1,
    pros_count: all_pros_count,
    is_not_last_page: curPage != pages_count,
    is_not_first_page: curPage != 1,
    cat_name: cat.name,
    childcat_name: childcat.name
  });
});

router.get("/", async function(req, res, next) {
  var cat_name = req.query.cat;
  var cat_id;
  console.log(req.query);
  if (cat_name == "all") {
    var cat = Category.instance.find({ name: cat_name }).exec();
    cat_id = cat._id;
  }
  await Product.instance.createIndexes({ name: "text" });
  var pros;
  var pros_to_count;
  if (req.query.search) {
    var key = '"' + req.query.search + '"';
    if (cat_id) {
      pros_to_count = await Product.instance
        .find({ $text: { $search: key }, cat_id: cat_id, isEnd: false })
        .exec();
      pros = await Product.instance
        .find({ $text: { $search: key }, cat_id: cat_id, isEnd: false })
        .limit(perPage)
        .sort({ submit_date: -1 })
        .exec();
    } else {
      pros_to_count = await Product.instance
        .find({ $text: { $search: key }, isEnd: false })
        .exec();
      pros = await Product.instance
        .find({ $text: { $search: key }, isEnd: false })
        .limit(perPage)
        .sort({ submit_date: -1 })
        .exec();
    }
  } else {
    if (cat_id) {
      pros_to_count = await Product.instance
        .find({ cat_id: cat_id, isEnd: false })
        .exec();
      pros = await Product.instance
        .find({ cat_id: cat_id, isEnd: false })
        .limit(perPage)
        .sort({ submit_date: -1 })
        .exec();
    } else {
      pros_to_count = await Product.instance.find({ isEnd: false }).exec();
      pros = await Product.instance
        .find({ isEnd: false })
        .limit(perPage)
        .sort({ submit_date: -1 })
        .exec();
    }
  }
  Product.addInfo(pros, res.locals.lcCategories, res.locals.lcUsers);
  //Số trang
  var all_pros_count = pros_to_count.length;
  var pages_count = Math.ceil(all_pros_count / 10);
  //Trang hiện tại
  var curPage = 1;
  res.render("shop", {
    title: "Search Page",
    products: pros,
    cur_page: curPage,
    next_page: curPage + 1,
    pre_page: curPage - 1,
    pros_count: all_pros_count,
    is_not_last_page: curPage != pages_count,
    is_not_first_page: curPage != 1,
    is_empty: all_pros_count == 0
  });
});

module.exports = router;
