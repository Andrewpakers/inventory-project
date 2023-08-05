const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.user_list = asyncHandler(async (req, res, next) => {
    const allUsers = await User.find().sort({ username: 1 }).exec();
    res.render("user_list", {
      title: "User List",
      user_list: allUsers,
    });
});

exports.user_detail = asyncHandler(async (req, res, next) => {
    res.render('user_detail', { title: 'User Detail', user: req.user });
});

exports.user_create_get = asyncHandler(async (req, res, next) => {
    res.render('auth', { title: 'Sign Up' });
});

exports.user_create_post = asyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        try {
            const user = new User({
              username: req.body.username,
              password: hashedPassword,
              join_date: new Date(),
            });
            const result = await user.save();
            res.redirect("/");
          } catch(err) {
            return next(err);
        };
    });
});

exports.user_login_get = asyncHandler(async (req, res, next) => {
    res.render('auth', { title: 'Log In' });
});

exports.user_delete_get = asyncHandler(async (req, res, next) => {
    if (!req.user || req.user.id !== req.params.id) {
        res.redirect("/");
    }
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (user === null) {
        res.redirect("/");
    }
    res.render("user_delete", { title: "Delete Account", user: user });
});

exports.user_delete_post = asyncHandler(async (req, res, next) => {
    if (!req.user || req.user.id !== req.body.userid) {
        res.redirect("/");
    }
    await User.findByIdAndRemove(req.body.userid);
    res.redirect("/logout");
});

exports.user_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User Update GET");
});

exports.user_update_post = [
    asyncHandler(async (req, res, next) => {
        res.send("NOT IMPLEMENTED: User Update POST");
    }),
]