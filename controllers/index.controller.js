const Blog = require("../models/blog.model");
const User = require("../models/UserModel");
const path = require("path");
const fs = require("fs");

exports.dashBoard = async (req, res) => {
    res.render("dashboard", { user: req.cookies.user || null });
};

exports.loginPage = async (req, res) => {
    res.render("login");
};

exports.loginUser = async (req, res) => {
   
};

exports.logout = async (req, res) => {
    res.clearCookie("user");
    res.redirect("/");
};

exports.profilePage = async (req, res) => {
    const user = req.cookies.user ? await User.findById(req.cookies.user._id) : null;
    res.render("profile", { user, imagePath: user?.image || "/uploads/default-profile.png" });
};

exports.changePasswordPage = async (req, res) => {
    const user = req.cookies.user ? await User.findById(req.cookies.user._id) : null;
    res.render("change_pass", { user });
};

exports.changePassword = async (req, res) => {
    const { old_password, password, c_password } = req.body;
    const user = await User.findById(req.cookies.user._id);
    if (!user || user.password !== old_password || password !== c_password) {
        return res.render("change_pass", { user, error: "Invalid input" });
    }
    user.password = password;
    await user.save();
    res.clearCookie("user");
    res.redirect("/");
};
