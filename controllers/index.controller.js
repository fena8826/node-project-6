const Blog = require("../models/blog.model");
const User = require("../models/UserModel");
const path = require("path");
const fs = require("fs");

exports.dashBoard = async (req, res) => {
    if (req.cookies && req.cookies.user && req.cookies.user._id) {
        return res.render("dashboard", { user: req.cookies.user });
    } else {
        return res.redirect("/");
    }
};


exports.loginPage = async (req, res) => {
    if (req.cookies && req.cookies.user && req.cookies.user._id) {
        return res.redirect("/dashboard");
    } else {
        return res.render("login");
    }
};


exports.loginUser = async (req, res) => {
    try {
        console.log(req.body);
        let user = await User.findOne({ email: req.body.email });
        console.log(user);

        if (user) {
            if (user.password == req.body.password) {
                res.cookie("user", user);
                return res.redirect("/dashboard");
            } else {
                console.log(" Password not matched");
                return res.redirect("/");
            }
        } else {
            console.log(" User not found");
            return res.redirect("/");
        }
    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.redirect("/");
    }
};


exports.logout = async (req, res) => {
    res.clearCookie("user");
    return res.redirect("/");
};


exports.profilePage = async (req, res) => {
    try {
        console.log("🔍 Checking User Cookie:", req.cookies.user);

        if (!req.cookies.user) {
            console.log("No user cookie found. Redirecting to login...");
            return res.redirect("/");
        }

        let user = await User.findById(req.cookies.user._id);
        if (!user) {
            console.log("User not found in DB. Clearing cookie and redirecting...");
            res.clearCookie("user");
            return res.redirect("/");
        }

        let imagePath = user.image && user.image.startsWith("/uploads/")
            ? user.image
            : "/uploads/default-profile.png";

        return res.render("profile", { user, imagePath });
    } catch (error) {
        console.error("Error in profilePage:", error);
        return res.redirect("back");
    }
};

exports.changePasswordPage = async (req, res) => {
    try {
        const userCookie = req.cookies.user;
        if (!userCookie) {
            return res.redirect("/");
        }

        const user = await User.findById(userCookie._id);
        if (!user) {
            res.clearCookie("user");
            return res.redirect("/");
        }

        res.render("change_pass", { user });
    } catch (error) {
        console.error("Error rendering change password page:", error);
        return res.redirect("/");
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { old_password, password, c_password } = req.body;
        const userCookie = req.cookies.user;

        if (!userCookie) {
            return res.redirect("/");
        }

        const user = await User.findById(userCookie._id);

        if (!user) {
            return res.render("change_pass", {
                error: "User not found",
                user: null
            });
        }

        if (user.password !== old_password) {
            console.log(" Old password does not match");
            return res.render("change_pass", { user, error: "Old password incorrect" });
        }

        if (password !== c_password) {
            console.log(" Password & Confirm password do not match");
            return res.render("change_pass", { user, error: "Passwords do not match" });
        }

        user.password = password;
        await user.save();
        console.log("Password Updated Successfully");

        res.clearCookie("user");
        return res.redirect("/");
    } catch (error) {
        console.error("Error in changePassword:", error);
        return res.render("change_pass", {
            error: "Something went wrong, please try again.",
            user: req.cookies.user || null
        });
    }
};
