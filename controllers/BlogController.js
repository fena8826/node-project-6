const Blog = require("../models/blog.model");
const path = require("path");
const fs = require("fs");


exports.addBlogPage = async (req, res) => {
  try {
    return res.render("add_blog", { user: null }); 
  } catch (error) {
    console.error(error);
    return res.redirect("/");
  }
};


exports.viewAllBlogsPage = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    const categories = await Blog.distinct("category");
    return res.render("view-all-blogs", {
      user: null,
      blogs,
      categories,
      search: "",
      category: "",
    });
  } catch (error) {
    console.error(error);
    return res.redirect("/");
  }
};


exports.MyBlogsPage = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return res.render("my_blogs", { blogs, user: null });
  } catch (error) {
    console.error(error);
    return res.redirect("/");
  }
};

exports.addNewBlog = async (req, res) => {
  try {
    let imagePath = req.file ? `/uploads/${req.file.filename}` : "";
    const author = "Guest"; 
    await Blog.create({
      ...req.body,
      author,
      userId: null, 
      image: imagePath,
    });
    return res.redirect("/blog/my-blogs");
  } catch (error) {
    console.error(error);
    return res.redirect("/blog/add-blog");
  }
};

exports.editBlogPage = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.redirect("/blog/my-blogs");

    return res.render("edit_blog", { blog, user: null });
  } catch (error) {
    console.error(error);
    return res.redirect("/blog/my-blogs");
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (req.file) {
      if (blog.image) {
        const oldImage = path.join(__dirname, "..", blog.image);
        try { fs.unlinkSync(oldImage); } catch {}
      }
      req.body.image = `/uploads/${req.file.filename}`;
    }
    await Blog.findByIdAndUpdate(blog._id, req.body, { new: true });
    return res.redirect("/blog/my-blogs");
  } catch (error) {
    console.error(error);
    return res.redirect("/blog/my-blogs");
  }
};


exports.deleteBlog = async (req, res) => {
 try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {

      if (blog.image) {
        const imagePath = path.join(__dirname, "..", blog.image);
        if (fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
            console.log("Blog image deleted successfully.");
          } catch (error) {
            console.log("Error deleting blog image:", error);
          }
        }
      }


      await Blog.findByIdAndDelete(req.params.id);
      console.log("Blog deleted successfully.");
    } else {
      console.log("Blog not found.");
    }

    return res.redirect("back");
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.redirect("back");
  }
};


exports.viewSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    return res.render("single-blog", { blog, user: null });
  } catch (error) {
    console.error(error);
    return res.redirect("/blog/view-all-blogs");
  }
};
