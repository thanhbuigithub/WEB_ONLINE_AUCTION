var express = require("express");
var router = express.Router();

const Category = require("../models/Category");
const User = require("../models/account");
const Product = require("../models/Product");
const Bid = require("../models/Bid");

Product.find().exec((err, db) => {
  /* GET home page. */
  router.get("/", function(req, res, next) {
    res.render("index", { title: "Acution Online", products: db });
  });
});

module.exports = router;
