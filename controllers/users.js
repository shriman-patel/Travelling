const User = require("../models/user.js");

// signup route
module.exports.loginForm = (req, res) => {
 res.render("users/signup.ejs");
};
module.exports.signup = async (req, res) => {
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
  };

  // login
  module.exports.login = (req, res) => {
  res.render("users/login.ejs");
}
 module.exports.loginRouter =  async(req, res) => {
     req.flash("success", "Welcome back to WonderLust!"); 
    let redirectUrl = res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl); 
  };

  // logout
   module.exports.logout = async(req,res)=>{
  req.logout((err) =>{
    if(err){
     return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  })
};

