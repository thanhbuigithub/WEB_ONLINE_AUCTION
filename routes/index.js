var express = require("express");
var router = express.Router();

const Category = require("../models/category.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Bid = require("../models/bid.model");

/* GET home page. */
router.get("/", function(req, res, next) {
  Product.instance.find().exec((err, pros) => {
    Category.instance.find().exec((err, cats) => {
      pros.forEach(element => {
        element.childcat_name = cats.find(
          obj => obj._id.$oid === element.cat_id.$oid
        ).childcat_name[element.childcat_pos].name;
      });
      res.render("index", {
        title: "Acution Online",
        products: pros,
        categories: cats
      });
    });
  });
});

module.exports = router;
