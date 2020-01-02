var express = require('express');
var router = express.Router();

// Require Controller Module
var member_controller = require('../controllers/accountController');


router.get('/post_product',member_controller.isLoggedIn, function(req, res, next) {
  res.render('seller/post_product', { title: 'Post Product Page' });
});

module.exports = router;