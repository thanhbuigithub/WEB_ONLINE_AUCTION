var express = require('express');
var router = express.Router();

/* GET cart page. */
router.get('/', function(req, res, next) {
  res.render('admin/admin_user', { title: 'Admin User Page'});
});

module.exports = router;