const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsyc = require("../utils/wrapAsyc");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsyc(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      // if user signup than automatic login
      req.login(registerUser,(err)=>{
        if(err){
          return next(err);
        }
         req.flash("success", "Welcome to WonderLust");
          res.redirect("/listings");
      })
      //}
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async(req, res) => {
     req.flash("success", "Welcome back to WonderLust!"); 
    let redirectUrl = res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl); 
  }
);
router.get("/logout",async(req,res)=>{
  req.logout((err) =>{
    if(err){
     return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  })
});

module.exports = router;
