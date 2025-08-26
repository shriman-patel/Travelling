const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsyc = require("../utils/wrapAsyc");
const passport = require("passport");
const userController = require("../controllers/users.js");
// signup route
router
.route("/signup")
.get(userController.loginForm)
.post(wrapAsyc(userController.signup));

// login router
router
.route("/login")
.get((userController.login))
.post(passport.authenticate("local", { failureRedirect: "/login",failureFlash: true, }), (userController.loginRouter));
// logout router
router.get("/logout",(userController.logout));

module.exports = router;
