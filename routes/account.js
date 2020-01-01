// var passport = require('passport');
var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

// Require Controller Module
var member_controller = require('../controllers/accountController');

/* Local Account */

router.get('/information', member_controller.isLoggedIn, member_controller.get_profile);
router.get('/logout', member_controller.isLoggedIn, member_controller.get_logout);
router.use('/', member_controller.notLogin_use);

router.get('/register', member_controller.notLoggedIn, member_controller.get_register);
router.post('/register', member_controller.post_register, member_controller.restrict);

router.get('/login', member_controller.notLoggedIn, member_controller.get_login);
router.post('/login', member_controller.post_login, member_controller.restrict);

/* Facebook Account */
router.get('/facebook', member_controller.notLoggedIn, member_controller.get_facebook_login);
router.get('/facebook/callback', member_controller.restrict);

router.get('/cart', member_controller.isLoggedIn, function (req, res, next) {
    res.render('account/cart', { title: 'Cart' });
});


module.exports = router;
