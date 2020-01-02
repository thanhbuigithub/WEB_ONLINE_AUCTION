const mongoose = require("mongoose");
const CatSchema = new mongoose.Schema({
  name: String,
  childcat_name: [{ name: String }]
});

var instance = mongoose.model("Category", CatSchema);

module.exports = {
  instance,
  getAll: async () => {
    var cats = await Category.instance.find().exec();
    return cats;
  }
};
