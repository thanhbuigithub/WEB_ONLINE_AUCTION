var express = require("express");
var router = express.Router();

const Category = require("../models/category.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Bid = require("../models/bid.model");

/* GET home page. */
router.get("/", async function(req, res, next) {
  var danhSachSapKetThuc = await Product.instance
    .find({ isEnd: false })
    .sort({ exp_date: 1 })
    .limit(5)
    .exec();
  var danhSachLuotRaGia = await Product.instance
    .find({ isEnd: false })
    .sort({ bid_count: -1 })
    .limit(5)
    .exec();
  var danhSachGiaCao = await Product.instance
    .find({ isEnd: false })
    .sort({ cur_price: -1 })
    .limit(5)
    .exec();
  Product.addChildName(danhSachSapKetThuc, res.locals.lcCategories);
  Product.addChildName(danhSachLuotRaGia, res.locals.lcCategories);
  Product.addChildName(danhSachGiaCao, res.locals.lcCategories);

  res.render("index", {
    title: "Acution Online",
    almostEndList: danhSachSapKetThuc.slice(1),
    almostEndPro: danhSachSapKetThuc[0],
    bidCountList: danhSachLuotRaGia.slice(1),
    bidCountPro: danhSachLuotRaGia[0],
    highPriceList: danhSachGiaCao.slice(1),
    highPricePro: danhSachGiaCao[0]
  });
  console.log(danhSachSapKetThuc[0].isNew);
});

router.post("/:id/addToWishList", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.json("-1");
  } else {
    var proId = req.params.id;
    var userId = req.user._id;
    console.log(userId);
    var property = {
      pro_id: proId
    };
    var user = await User.findById(userId).exec();
    console.log(user);
    user.wish_list.push(property);
    await user.save();
    res.json("1");
  }
});

router.post("/:id/removeFromWishList", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.json("-1");
  } else {
    var proId = req.params.id;
    var userId = req.user._id;
    var user = await User.findById(userId).exec();
    var wish_list = user.wish_list;
    wish_list.splice(
      wish_list.findIndex(v => v.pro_id == proId),
      1
    );
    await user.save();
    res.json("1");
  }
});

router.post("/evaluate_bidder", async (req, res) => {
  var id = req.body.id;
  var point = parseInt(req.body.point);
  var text = req.body.text;
  var user = await User.findById(id).exec();
  if (user.evaluate) {
    user.evaluate.push({
      point: point,
      text: text
    });
  } else {
    user.evaluate = [];
    user.evaluate.push({
      point: point,
      text: text
    });
  }
  console.log(user.local.rate_point);
  user.rate_point.sum++;
  if (point > 0) {
    user.rate_point.plus += point;
  }
  await user.save();
  res.redirect("/account/" + req.user._id + "/information");
});

module.exports = router;
