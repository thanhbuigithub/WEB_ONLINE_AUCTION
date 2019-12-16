var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('post_product', { title: 'Post Product Page' });
});

module.exports = router;