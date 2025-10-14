const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  gender: String,
  hobbies: Array,
  image: String,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
