var express = require("express");
var router = express.Router();

var moment = require("moment");
const Category = require("../models/category.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Bid = require("../models/bid.model");
const nodemailer = require("nodemailer");
var member_controller = require("../controllers/accountController");
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "web.auction.mailing.system", // generated ethereal user
    pass: "thanhtc2" // generated ethereal password
  }
});
/* GET home page. */
router.get("/:id", async function(req, res, next) {
  var id = req.params.id;
  var user = req.user;
  var pro = await Product.instance.findById(id).exec();
  var cat = await Category.instance.findById(pro.cat_id).exec();
  var Seller = await User.findById(pro.seller_id)
    .lean()
    .exec();
  var relate_pros = await Product.instance
    .find({ cat_id: pro.cat_id, isEnd: false })
    .limit(6)
    .exec();
  relate_pros.forEach(element => {
    element.imgFileName = element.img[0].filename;
  });
  //Thêm tên danh mục
  pro.childcat_name = cat.childcat_name[pro.childcat_pos].name;

  //Lịch sử dấu giá
  var historyList = await Bid.instance
    .find({ pro_id: id })
    .lean()
    .sort({ price: -1, bid_time: 1 })
    .limit(5)
    .exec();
  for (var i = 0; i < historyList.length; i++) {
    var item = historyList[i];
    var time = new Date(item.bid_time);
    var user_id = item.user_id;
    item.bid_time_convert = moment(time, "YYYY-MM-DD'T'HH:mm:ss.SSSZ").format(
      "D/MM/YYYY HH:mm"
    );
    var user = await User.findById(user_id)
      .lean()
      .exec();
    item.user_name = user.info.lname;
  }

  //Người bán
  Seller.full_name = Seller.info.fname + " " + Seller.info.lname;
  if (Seller.rate_point.sum == 0) {
    Seller.isNew = true;
  } else {
    Seller.isNew = false;
    Seller.point = Math.round(
      (Seller.rate_point.plus / Seller.rate_point.sum) * 100
    );
  }

  //Người mua
  if (pro.bid_count > 0) {
    var Winner = await User.findById(pro.winner_id)
      .lean()
      .exec();
    Winner.full_name = Winner.info.fname + " " + Winner.info.lname;
    if (Winner.rate_point.sum == 0) {
      Winner.isNew = true;
    } else {
      Winner.isNew = false;
      Winner.point = Math.round(
        (Winner.rate_point.plus / Winner.rate_point.sum) * 100
      );
    }
  }

  var submit_date = new Date(pro.submit_date);
  pro.submit_date_convert = moment(
    submit_date,
    "YYYY-MM-DD'T'HH:mm:ss.SSSZ"
  ).format("D/MM/YYYY");

  var isWinner = false;
  var isSeller = false;
  if (user) {
    if (pro.winner_id) {
      isWinner = pro.winner_id.equals(user._id);
    }
    isSeller = pro.seller_id.equals(user._id);
  }

  var is_accepted = true;
  if (req.user) {
    if (req.user.rate_point.sum > 0) {
      is_accepted =
        (req.user.rate_point.plus / req.user.rate_point.sum) * 100 >= 80;
    }
  }

  res.render("product", {
    title: "Product Page",
    product: pro,
    suggest_price: pro.cur_price + pro.step_price,
    bidList: historyList,
    seller: Seller,
    is_seller: isSeller,
    is_winner: isWinner,
    is_bidded: pro.bid_count > 0,
    winner: Winner,
    is_accepted: is_accepted,
    relate_pros: relate_pros
  });
  req.session.retUrl = "/product/" + id;
});

router.post("/:id/bid", member_controller.isLoggedIn, async function(
  req,
  res,
  next
) {
  var id = req.params.id;
  var pro = await Product.instance.findById(id).exec();
  var second_left = (pro.exp_date - Date.now()) / 1000;
  console.log(second_left);
  if (second_left < 300 && pro.auto_renew) {
    pro.exp_date.setMinutes(pro.exp_date.getMinutes() + 10);
    pro.markModified("exp_date");
    await pro.save();
    console.log(pro.exp_date);
  }
  var user = req.user;
  var max_price = parseInt(req.body.max_price);
  var newBid = {
    pro_id: id,
    user_id: user._id
  };
  if (pro.bid_count == 0) {
    pro.winner_id = user._id;
    pro.max_price = max_price;
    newBid.price = pro.cur_price;
    var doc = new Bid.instance(newBid);
    await doc.save();
    res.redirect("/");
  } else {
    if (max_price > pro.max_price) {
      pro.winner_id = user._id;
      pro.cur_price = pro.max_price + pro.step_price;
      pro.max_price = max_price;
      newBid.price = pro.cur_price;
      var doc = new Bid.instance(newBid);
      await doc.save();
      res.redirect("/");
    } else {
      pro.cur_price = max_price;
      var bid = await Bid.instance
        .find({ user_id: user._id })
        .limit(1)
        .exec();
      bid[0].price = max_price;
      await bid[0].save();
      newBid.price = max_price;
      var doc = new Bid.instance(newBid);
      await doc.save();
      res.redirect("/");
    }
  }
  pro.bid_count++;
  await pro.save();
  let info = await transporter.sendMail({
    from: '"Mailing System Web Auction" <web.auction.mailing.system@gmail.com>', // sender address
    to: user.local.email, // list of receivers
    subject: "Đặt giá thành công", // Subject line
    text:
      "Chúc mừng bạn đã đặt giá thành công: " +
      max_price +
      " cho sản phẩm " +
      pro.name // plain text body
    // html: "<b>Hello world?</b>" // html body
  });
  console.log(info);
});

module.exports = router;
