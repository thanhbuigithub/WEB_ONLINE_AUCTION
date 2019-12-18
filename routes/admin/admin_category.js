var express = require('express');
var router = express.Router();

/* GET cart page. */
router.get('/', function(req, res, next) {
  res.render('admin/admin_category', { title: 'Admin Category Page'});
});

router.get('/add', (req, res) => {
  res.render('vwCategory/add');
})
module.exports = router;