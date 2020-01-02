var express = require("express");
var router = express.Router();
//var csrf = require("csurf");
var bodyParser = require("body-parser");
var Product = require("../models/product.model");
var multer = require("multer");
var path = require("path");
// var csrfProtection = csrf();
// router.use(csrfProtection);

// Require Controller Module
var member_controller = require("../controllers/accountController");

//Setup multer
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function(req, file, cb) {
    cb(null, "product-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).array("img");

/* GET home page. */
router.get("/", member_controller.isSeller, function(req, res, next) {
  res.render("seller/post_product", { title: "Post Product Page" });
});

router.post("/", member_controller.isSeller, async function(req, res, next) {
  upload(req, res, async err => {
    if (err)
      res.render("seller/post_product", {
        title: "Post Product Page",
        msg: err
      });
    else {
      var product = req.body;
      var cat = product.cat_id.split("-");
      product.cat_id = cat[1];
      product.childcat_pos = parseInt(cat[0]);
      product.cur_price = product.start_price;
      product.seller_id = req.user._id;
      product.img = [];
      var f = req.files;
      f.forEach(element => {
        var file = {
          filename: element.path
        };
        product.img.push(file);
      });
      console.log(product);
      var item = new Product.instance(product);
      var doc = await item.save();
      res.redirect("/product/" + doc._id);
    }
  });
});

module.exports = router;
