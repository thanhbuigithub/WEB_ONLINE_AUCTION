// var passport = require('passport');
var express = require("express");
var router = express.Router();
const Category = require("../models/category.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
var csrf = require("csurf");

const multer = require("multer");
var path = require("path");

//Setup multer
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function(req, file, cb) {
    cb(null, "user-" + Date.now() + path.extname(file.originalname));
  }
});

// Require Controller Module
var member_controller = require("../controllers/accountController");

var csrfProtection = csrf({ cookie: true });
const upload = multer({ storage: storage }).single("img");
router.post(
  "/:id/information/update",
  upload,
  csrfProtection,
  member_controller.post_update_information
);
router.use(csrfProtection);

/* Local Account */

router.get(
  "/:id/information",
  member_controller.isLoggedIn,
  member_controller.get_profile
);
// router.get('/information', member_controller.isLoggedIn, (req, res) => {
//     res.render('account/user_information', {
//         title: 'User Information'
//     });
// });
// router.get('/information', member_controller.isLoggedIn, member_controller.get_profile);
router.get(
  "/:id/information/update",
  member_controller.isLoggedIn,
  member_controller.get_update_information
);

router.get(
  "/logout",
  member_controller.isLoggedIn,
  member_controller.get_logout
);
router.use("/", member_controller.notLogin_use);
router.get(
  "/register",
  member_controller.notLoggedIn,
  member_controller.get_register
);
router.post(
  "/register",
  member_controller.recaptcha,
  member_controller.post_register,
  member_controller.restrict
);

router.get(
  "/login",
  member_controller.notLoggedIn,
  member_controller.get_login
);
router.post("/login", member_controller.post_login, member_controller.restrict);

router.get("/cart", member_controller.isLoggedIn, async function (
  req,
  res,
  next
) {
  var user = req.user;
  var length = user.bids_count;
  var sum = 0;
  var pros = await Product.instance
    .find({ _id: { $in: user.bids_pro_id }, isEnd: false })
    .lean()
    .exec();

  for (var i = 0; i < length; i++) {
    if (pros[i].winner_id) {
      var winner = await User.findById(pros[i].winner_id).exec();
      pros[i].winner_name = winner.info.fname + " " + winner.info.lname;
      if (pros[i].winner_id.equals(user._id)) {
        pros[i].user_is_winner = true;
      }
    }
    pros[i].img_filename = pros[i].img[0].filename;
    sum += pros[i].cur_price;
  }
  res.render("account/cart", {
    title: "Bidding Products",
    products: pros,
    isEmpty: length == 0,
    sum_price: sum
  });
});

router.get("/wishlist", member_controller.isLoggedIn, async function (
  req,
  res,
  next
) {
  var user = req.user;
  var pros_id = [];
  var length = user.wish_list.length;
  var sum = 0;
  for (var i = 0; i < length; i++) {
    pros_id.push(user.wish_list[i].pro_id);
  }
  var pros = await Product.instance
    .find({ _id: { $in: pros_id }, isEnd: false })
    .lean()
    .exec();
  console.log(pros_id);
  console.log(pros);
  for (var i = 0; i < length; i++) {
    if (pros[i].winner_id) {
      var winner = await User.findById(pros[i].winner_id).exec();
      pros[i].winner_name = winner.info.fname + " " + winner.info.lname;
      if (pros[i].winner_id.equals(user._id)) {
        pros[i].user_is_winner;
      }
    }
    pros[i].img_filename = pros[i].img[0].filename;
    sum += pros[i].cur_price;
  }
  res.render("account/cart", {
    title: "Wishlist Products",
    products: pros,
    isEmpty: length == 0,
    sum_price: sum
  });
});

router.get("/:id/upgrade", member_controller.isLoggedIn, async (req, res, next) => {
  var user = await User.findById({"_id":req.params.id}).exec();
  if(!user.local.is_upgrade && user.local.is_upgrade === false){
    console.log("Không được phép nâng cấp !");
  }else{
    user.local.is_upgrade = false;
    console.log("Chờ xét duyệt !");
    res.redirect(`/account/${req.params.id}/information`);
  }
})
router.get("/payment", member_controller.isLoggedIn, function (req, res, next) {
  res.render("account/payment", { title: "Payment" });
});

router.get("/evaluate/:id", member_controller.isLoggedIn, async function(
  req,
  res,
  next
) {
  var id = req.params.id;
  var user = await User.findById(id).exec();
  if (user.rate_point.sum == 0) {
    user.isNew = true;
  } else {
    user.isNew = false;
    user.point = Math.round((user.rate_point.plus / user.rate_point.sum) * 100);
  }
  user.rate_point.minus = user.rate_point.sum - user.rate_point.plus;
  res.render("account/evaluate", {
    title: "Đánh giá " + user.info.fname + " " + user.info.lname,
    _user: user
  });
});
module.exports = router;
