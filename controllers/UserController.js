const mongoose = require("mongoose");
const User = require("../models/UserModel");
const path = require("path");
const fs = require("fs");

exports.logout = async (req, res) => {
  res.clearCookie("user");
  return res.redirect("/");
};

exports.loginPage = async (req, res) => {
  if (req.cookies?.user?._id) return res.redirect("/dashboard");
  return res.render("login");
};


exports.dashBoard = async (req, res) => {
  if (!req.cookies?.user?._id) {
    const user = {
      _id: "",
      firstname: "",
      lastname: "",
      email: "",
    };
    res.cookie("user", user);
    return res.render("dashboard", { user });
  }
  return res.render("dashboard", { user: req.cookies.user });
};


exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.redirect("/");

    if (user.password !== req.body.password) {
      console.log("Password mismatch");
      return res.redirect("/");
    }

    res.cookie("user", user);
    return res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.redirect("/");
  }
};


exports.profilePage = async (req, res) => {
  try {
    if (!req.cookies?.user?._id) return res.redirect("/");

    let user = null;
    if (mongoose.Types.ObjectId.isValid(req.cookies.user._id)) {
      user = await User.findById(req.cookies.user._id);
    } else {
      user = req.cookies.user;
    }

    const imagePath = user.image?.startsWith("/uploads/")
      ? user.image
      : "/uploads/default-profile.png";

    return res.render("profile", { user, imagePath });
  } catch (error) {
    console.error(error);
    return res.redirect("back");
  }
};


exports.changePasswordPage = async (req, res) => {
  if (!req.cookies?.user?._id) return res.redirect("/");
  let user = null;

  if (mongoose.Types.ObjectId.isValid(req.cookies.user._id)) {
    user = await User.findById(req.cookies.user._id);
  } else {
    user = req.cookies.user;
  }

  res.render("change_pass", { user });
};

exports.changePassword = async (req, res) => {
  try {
    const { old_password, password, c_password } = req.body;
    const userCookie = req.cookies.user;
    if (!userCookie) return res.redirect("/");

    let user = null;
    if (mongoose.Types.ObjectId.isValid(userCookie._id)) {
      user = await User.findById(userCookie._id);
      if (!user)
        return res.render("change_pass", {
          user: null,
          error: "User not found",
        });

      if (user.password !== old_password) {
        return res.render("change_pass", {
          user,
          error: "Old password does not match",
        });
      }

      if (password !== c_password) {
        return res.render("change_pass", {
          user,
          error: "Password and confirm password do not match",
        });
      }

      user.password = password;
      await user.save();
    }

    res.clearCookie("user");
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.render("change_pass", {
      user: req.cookies.user || null,
      error: "Something went wrong",
    });
  }
};


exports.addUserPage = async (req, res) => {
  if ( req.cookies == null ||
    req.cookies.user == undefined ||
    req.cookies.user._id == undefined) {
    return res.redirect("/");
  }

  let user = null;
  if (mongoose.Types.ObjectId.isValid(req.cookies.user._id)) {
    user = await User.findById(req.cookies.user._id);
  } else {
    user = req.cookies.user;
  }

  return res.render("add_user", { user });
};


exports.viewAllUserPage = async (req, res) => {
  try {
    let users = await User.find();
    const userCookie = req.cookies.user;
    const user = userCookie && mongoose.Types.ObjectId.isValid(userCookie._id)
      ? await User.findById(userCookie._id)
      : userCookie || null;

    return res.render("view_all_user", { users, user });
  } catch (error) {
    console.error("Error loading users:", error);
    return res.redirect("back");
  }
};

exports.addNewUser = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    await User.create(req.body);
    return res.redirect("/user/view-users");
  } catch (error) {
    console.log(error);
  }
};


exports.editUserPage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      return res.render("edit_user", { user });
    } else {
      return res.redirect("/user/view-users");
    }
  } catch (error) {
    console.log(error);
  }
};


exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
   
      if (req.file) {
        const oldPath = path.join(__dirname, "..", user.image || "");
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch {
            console.log("Old image not found...");
          }
        }
        req.body.image = `/uploads/${req.file.filename}`;
      }

      await User.findByIdAndUpdate(user._id, req.body, { new: true });
      console.log(" User updated successfully.");
      return res.redirect("/user/view-users");
    } else {
      console.log("User not found.");
      return res.redirect("/user/view-users");
    }
  } catch (error) {
    console.log("Error updating user:", error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (user) {
      if (user.image) {
        const imagePath = path.join(__dirname, "..", user.image);
        if (fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
            console.log("Old image deleted successfully.");
          } catch (error) {
            console.log("Error deleting file:", error);
          }
        }
      }

      await User.findByIdAndDelete(id);
      console.log(" User deleted successfully.");
      return res.redirect("/user/view-users");
    } else {
      console.log(" User not found.");
      return res.redirect("/user/view-users");
    }
  } catch (error) {
    console.log("Error deleting user:", error);
    return res.redirect("/user/view-users");
  }
};
