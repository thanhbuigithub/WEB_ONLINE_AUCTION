var express = require("express");
var router = express.Router();

const Category = require("../models/Category");
const User = require("../models/User");
const Product = require("../models/Product");
const Bid = require("../models/Bid");

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
