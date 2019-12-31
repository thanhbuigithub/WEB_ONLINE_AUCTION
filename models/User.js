const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  dob: Date,
  permission: Boolean,
  rate_point: {
    sum: Number,
    plus: Number
  }
});

module.exports = mongoose.model("User", UserSchema);
