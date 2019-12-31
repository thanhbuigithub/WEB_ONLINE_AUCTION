var express = require('express');
var router = express.Router();

// Require Controller Module
var member_controller = require('../controllers/accountController');


router.get('/post_product',member_controller.isLoggedIn, function(req, res, next) {
  res.render('admin/post_product', { title: 'Post Product Page' });
});


router.get('/categories',member_controller.isLoggedIn, function(req, res, next) {
  res.render('admin/admin_category', { title: 'Admin Category Page'});
});

router.get('/products',member_controller.isLoggedIn, function(req, res, next) {
    res.render('admin/admin_product', { title: 'Admin Product Page'});
  });

router.get('/user-info',member_controller.isLoggedIn, function(req, res, next) {
    res.render('admin/admin_user', { title: 'Admin User Page'});
});


router.get('/categories/add',member_controller.isLoggedIn, (req, res) => {
  res.render('vwCategory/add');
})

module.exports = router;
