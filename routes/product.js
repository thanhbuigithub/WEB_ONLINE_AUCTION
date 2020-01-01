var express = require("express");
var router = express.Router();

const Category = require("../models/Category");
const User = require("../models/User");
const Product = require("../models/Product");
const Bid = require("../models/Bid");

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
