const mongoose = require("mongoose");
const Category = require("./category.model");
const ProSchema = new mongoose.Schema({
  name: String,
  cat_id: mongoose.Schema.Types.ObjectId,
  childcat_pos: Number,
  size: String,
  weight: Number,
  status: String,
  start_price: Number,
  summit_date: Date,
  exp_date: Date,
  min_price: Number,
  cur_price: Number,
  seller_id: mongoose.Schema.Types.ObjectId,
  winner_id: mongoose.Schema.Types.ObjectId,
  bid_count: Number,
  auto_renew: Boolean
});
var instance = mongoose.model("Product", ProSchema);
module.exports = {
  instance,

  getChildCatName: _id => {
    instance.findById(_id).exec((err, product) => {
      Category.instance.findById(product.cat_id).exec((err, category) => {
        return category.childcat_name[product.childcat_pos];
      });
    });
  }
};
