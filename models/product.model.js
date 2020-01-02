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
  summit_date: { type: Date, default: Date.now() },
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
  addChildName: (pros, cats) => {
    pros.forEach(element => {
      element.childcat_name = cats.find(
        obj => obj._id.$oid === element.cat_id.$oid
      ).childcat_name[element.childcat_pos].name;
    });
  }
};
