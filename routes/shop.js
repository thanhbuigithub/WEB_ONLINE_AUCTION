var express = require('express');
var moment = require('moment');
var router = express.Router();
const Product = require("../models/product.model");
/* GET shop page. */
router.get('/', async function (req, res, next) {
  var Products = await Product.instance
    .find()
    .limit(10)
    .sort({ submit_date: -1 })
    .exec();
  res.render('shop', { title: 'Shop Page', Products: Products});
});

module.exports = router;