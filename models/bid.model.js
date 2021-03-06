const mongoose = require("mongoose");
const BidSchema = new mongoose.Schema({
  pro_id: mongoose.Schema.Types.ObjectId,
  user_id: mongoose.Schema.Types.ObjectId,
  price: Number,
  bid_time: { type: Date, default: Date.now() }
});

var instance = mongoose.model("Bid", BidSchema);

module.exports = {
  instance
};
