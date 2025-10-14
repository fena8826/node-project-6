const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: String,
  content: String,
  author: String,
  category: String,
  language: String,
  date: Date,
  image: String,
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } 
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
