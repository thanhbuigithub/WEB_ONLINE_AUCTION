const mongoose = require("mongoose");
const CatSchema = new mongoose.Schema({
  name: String,
  child_cat_name: [String]
});

module.exports = mongoose.model("Category", CatSchema);
