const mongoose = require("mongoose");
const Category = require("./category.model");
const ProSchema = new mongoose.Schema({
  name: String,
  cat_id: mongoose.Schema.Types.ObjectId,
  childcat_pos: Number,
  img: [{ filename: String }],
  size: String,
  weight: Number,
  status: String,
  start_price: Number,
  step_price: Number,
  purchase_price: Number,
  submit_date: { type: Date, default: Date.now() },
  exp_date: {
    type: Date,
    default: () => {
      var date = new Date();
      return date.setDate(date.getDate() + 7);
    }
  },
  min_price: Number,
  cur_price: { type: Number },
  seller_id: mongoose.Schema.Types.ObjectId,
  winner_id: mongoose.Schema.Types.ObjectId,
  bid_count: { type: Number, default: 0 },
  auto_renew: Boolean,
  product_info: String,
  max_price: { type: Number, default: 0 },
  isEnd: { type: Boolean, default: false }
});
ProSchema.method.isNew = () => {
  return (this.submit_date - Date.now()) / 1000 < 3600;
};

var instance = mongoose.model("Product", ProSchema);

module.exports = {
  instance,
  addChildName: (pros, cats) => {
    pros.forEach(element => {
      element.childcat_name = cats.find(
        obj => obj._id.$oid === element.cat_id.$oid
      ).childcat_name[element.childcat_pos].name;
      var date = new Date(element.submit_date);
      element.isNew = (Date.now() - date) / 1000 < 3600;
      if (element.img[0] != undefined)
        element.imgFileName = element.img[0].filename;
    });
  }
};
