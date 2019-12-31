const mongoose = require("mongoose");
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

module.exports = mongoose.model("Product", ProSchema);
