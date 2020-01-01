var express = require("express");
var router = express.Router();

const Category = require("../models/category.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Bid = require("../models/bid.model");

/* GET home page. */
router.get("/:id", function(req, res, next) {
  var id = req.params.id;

  Product.instance.find().exec((err, pros) => {
    Category.instance.find().exec((err, cats) => {
      pros.forEach(element => {
        element.childcat_name = cats.find(
          obj => obj._id.$oid === element.cat_id.$oid
        ).childcat_name[element.childcat_pos].name;
      });

      var pro = pros.find(obj => obj._id == id);
      console.log(pro);
      res.render("product", {
        title: "Product Page",
        products: pros,
        thisPro: pro,
        categories: cats
      });
    });
  });
});

module.exports = router;
