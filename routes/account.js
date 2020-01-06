// var passport = require('passport');
var express = require("express");
var router = express.Router();
var csrf = require("csurf");

var Product = require("../models/product.model");
var User = require("../models/user.model");

var csrfProtection = csrf();
router.use(csrfProtection);

// Require Controller Module
var member_controller = require("../controllers/accountController");

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
// router.post('/information/update',member_controller.post_update_information);
router.post(
  "/:id/information/update",
  member_controller.post_update_information
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

router.get("/cart", member_controller.isLoggedIn, async function(
  req,
  res,
  next
) {
  var user = req.user;
  var length = user.bids_count;
  var sum = 0;
  var pros = await Product.instance
    .find({ _id: { $in: user.bids_pro_id } })
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

router.get("/wishlist", member_controller.isLoggedIn, async function(
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
    .find({ _id: { $in: pros_id } })
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

router.get("/payment", member_controller.isLoggedIn, function(req, res, next) {
  res.render("account/payment", { title: "Payment" });
});
module.exports = router;
