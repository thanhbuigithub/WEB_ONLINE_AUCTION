var express = require('express');
var router = express.Router();

/* GET cart page. */
router.get('/', function(req, res, next) {
  res.render('admin/admin_product', { title: 'Admin Product Page'});
});

module.exports = router;