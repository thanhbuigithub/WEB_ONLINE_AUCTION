// var passport = require('passport');
var express = require('express');
var router = express.Router();
const Category = require("../models/category.model");
const Product = require("../models/product.model");
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

// Require Controller Module
var member_controller = require('../controllers/accountController');

/* Local Account */

router.get('/:id/information', member_controller.isLoggedIn, member_controller.get_profile);
// router.get('/information', member_controller.isLoggedIn, (req, res) => {
//     res.render('account/user_information', {
//         title: 'User Information'
//     });
// });
// router.get('/information', member_controller.isLoggedIn, member_controller.get_profile);
router.get('/:id/information/update', member_controller.isLoggedIn, member_controller.get_update_information);
router.post('/:id/information/update', member_controller.post_update_information);
router.get('/logout', member_controller.isLoggedIn, member_controller.get_logout);
router.use('/', member_controller.notLogin_use);

router.get('/register', member_controller.notLoggedIn, member_controller.get_register);
router.post('/register', member_controller.recaptcha, member_controller.post_register, member_controller.restrict);

router.get('/login', member_controller.notLoggedIn, member_controller.get_login);
router.post('/login', member_controller.post_login, member_controller.restrict);

router.get('/cart/:id', member_controller.isLoggedIn, async function (req, res, next) {
    var id = req.params.id;
    var pro = await Product.instance.findById(id).exec();
    var cat = await Category.instance.findById(pro.cat_id).exec();
    pro.childcat_name = cat.childcat_name[pro.childcat_pos].name;

    res.render("account/cart", {
        title: "Cart Page",
        product: pro
    });
});
router.post("/cart/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
        res.json("-1");
    } else {
        var proId = req.params.id;
        var userId = req.user._id;
        var property = {
            pro_id: proId
        };
        var user = await User.findById(userId).exec();
        user.cart_item.push(property);
        await user.save();
        res.json("1");
        res.redirect("/account/payment")
    }
});
router.get('/wishlist', member_controller.isLoggedIn, function (req, res, next) {
    res.render('account/wishlist', { title: 'Wishlist Product' });
});

router.get('/payment', member_controller.isLoggedIn, function (req, res, next) {
    res.render('account/payment', { title: 'Payment' });
});
module.exports = router;
