var express = require("express");
var router = express.Router();
const Category = require("../models/category.model");
const User = require("../models/user.model");
// Require Controller Module
var member_controller = require("../controllers/accountController");

router.get(
  "/categories",
  member_controller.isLoggedIn,
  async (req, res, next) => {
    var cat = await Category.instance.find({}).exec();
    res.render("admin/admin_category", {
      title: "Admin Category Page",
      Cats: cat
    });
  }
);

//Duyệt nâng cấp
router.get("/upgrade", member_controller.isLoggedIn, async (req, res, next) => {
  var user = await User.find({ "local.is_upgrade": true }).exec();
  res.render("admin/admin_upgrade", {
    title: "Admin Upgrade Page",
    User: user
  });
});

router.get(
  "/upgrade/:id/active",
  member_controller.isLoggedIn,
  async (req, res, next) => {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { "local.is_upgrade": false, "local.permission": 1 },
      (err, doc) => {
        if (err) {
          throw err;
        }
        res.redirect("/admin/upgrade");
      }
    );
  }
);

router.get(
  "/upgrade/:id/unactive",
  member_controller.isLoggedIn,
  async (req, res, next) => {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { "local.is_upgrade": false, "local.permission": 0 },
      (err, doc) => {
        if (err) {
          throw err;
        }
        res.redirect("/admin/upgrade");
      }
    );
  }
);

router.get(
  "/user-info",
  member_controller.isLoggedIn,
  async (req, res, next) => {
    var bidder = await User.find({ "local.permission": 0 }).exec();
    var seller = await User.find({ "local.permission": 1 }).exec();
    res.render("admin/admin_user", {
      title: "Admin User Page",
      Bidder: bidder,
      Seller: seller
    });
  }
);

router.get(
  "/user-info/bidder/:id",
  member_controller.isLoggedIn,
  (req, res, next) => {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { status: "SUSPENDED", "local.permission": -1 },
      (err, doc) => {
        if (err) {
          throw err;
        }
        res.redirect("/admin/user-info");
      }
    );
  }
);

router.get(
  "/user-info/seller/:id",
  member_controller.isLoggedIn,
  (req, res, next) => {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { status: "SUSPENDED", "local.permission": -1 },
      (err, doc) => {
        if (err) {
          throw err;
        }
        res.redirect("/admin/user-info");
      }
    );
  }
);

// Thao tác với danh mục sản phẩm
router.get(
  "/categories/add",
  member_controller.isLoggedIn,
  async (req, res) => {
    res.render("admin/vwCategory/add");
  }
);

router.post(
  "/categories/add",
  member_controller.isLoggedIn,
  async (req, res) => {
    var cat = new Category.instance({
      name: req.body.txtCatName
    });
    cat.save(err => {
      if (err) throw err;
      res.redirect("/admin/categories");
    });
  }
);

router.get(
  "/categories/:id/edit",
  member_controller.isLoggedIn,
  async (req, res) => {
    var cat = await Category.instance.findById({ _id: req.params.id }).exec();
    res.render("admin/vwCategory/edit", { Cats: cat });
  }
);

router.post(
  "/categories/:id/edit",
  member_controller.isLoggedIn,
  async (req, res) => {
    Category.instance.findOneAndUpdate(
      { _id: req.params.id },
      { name: req.body.txtCatName },
      (err, doc) => {
        if (err) {
          throw err;
        }
        res.redirect("/admin/categories");
      }
    );
  }
);

router.get(
  "/categories/:id/delete",
  member_controller.isLoggedIn,
  (req, res) => {
    Category.instance.findOneAndDelete({ _id: req.params.id }, (err, doc) => {
      if (err) {
        throw err;
      }
      res.redirect("/admin/categories");
    });
  }
);

module.exports = router;
