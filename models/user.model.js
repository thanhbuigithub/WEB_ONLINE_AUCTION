var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
// var moment = require('moment');

var userSchema = new mongoose.Schema({
  info: {
    fname: String,
    lname: String,
    addr: String,
    dob: String
  },
  local: {
    email: String,
    username: {
      type: String
    },
    password: {
      type: String
    },
    is_upgrade: { type: Boolean, default: false },
    permission: { type: Number, default: 0 }
  },
  rate_point: {
    sum: { type: Number, default: 0 },
    plus: { type: Number, default: 0 }
  },
  status: String,
  wish_list: { type: Array },
  cart_item: { type: Array },
  avatar_filename: { type: String },
  evaluate: [
    {
      point: Number,
      text: String
    }
  ]
});

// Mã hóa mật khẩu
userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};
// Giải mã mật khẩu
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};
//Kiểm tra tài khoản có trùng username không ?
userSchema.methods.validAccount = function(username) {
  if (this.local.username === username) {
    return true;
  } else {
    return false;
  }
};
//Kiểm tra tài khoản có được kích hoạt không ?
userSchema.methods.isInActivated = function(checkStatus) {
  if (checkStatus === "INACTIVE") {
    return true;
  } else {
    return false;
  }
};
//Kiểm tra tài khoản có bị vô hiệu hóa không ?
userSchema.methods.isSuspended = function(checkStatus) {
  if (checkStatus === "SUSPENDED") {
    return true;
  } else {
    return false;
  }
};
module.exports = mongoose.model("User", userSchema);
