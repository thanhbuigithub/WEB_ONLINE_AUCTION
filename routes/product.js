var express = require("express");
var router = express.Router();

const Category = require("../models/category.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Bid = require("../models/bid.model");

/* GET home page. */
router.get("/:id", async function(req, res, next) {
  var id = req.params.id;
  var pro = await Product.instance.findById(id).exec();
  var cat = await Category.instance.findById(pro.cat_id).exec();
  pro.childcat_name = cat.childcat_name[pro.childcat_pos].name;
  res.render("product", {
    title: "Product Page",
    product: pro
  });
});

module.exports = router;
