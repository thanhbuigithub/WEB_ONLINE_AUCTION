var express = require('express');
var router = express.Router();

// Require Controller Module
var member_controller = require('../controllers/accountController');

router.get('/categories',member_controller.isLoggedIn, function(req, res, next) {
  res.render('admin/admin_category', { title: 'Admin Category Page'});
});

router.get('/upgrade',member_controller.isLoggedIn, function(req, res, next) {
    res.render('admin/admin_upgrade', { title: 'Admin Upgrade Page'});
  });

router.get('/user-info',member_controller.isLoggedIn, function(req, res, next) {
    res.render('admin/admin_user', { title: 'Admin User Page'});
});

// Thao tác với danh mục sản phẩm
router.get('/categories/add',member_controller.isLoggedIn, (req, res) => {
  res.render('admin/vwCategory/add');
})
router.get('/categories/edit',member_controller.isLoggedIn, (req, res) => {
  res.render('admin/vwCategory/edit');
})

router.get('/categories/delete',member_controller.isLoggedIn, (req, res) => {
  res.send('Mình theo tác trực tiếp ko render view')
})


module.exports = router;
