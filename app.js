if(process.env.NODE_ENV != "production"){
require(`dotenv`).config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride =  require("method-override"); 
const ejsMate = require("ejs-mate");// use create  multiple template
const expressLayouts = require("express-ejs-layouts");
const expressError =  require("./utils/expressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");




// for Authantication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
app.use(expressLayouts);
app.use(express.static(path.join(__dirname,"/public")));
app.set("layout", "layouts/boilerplate");
app.use(methodoverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended : true}));
app.engine('ejs', ejsMate);

const dbUrl = process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(dbUrl);
};
main().
 then(()=> {console.log("connection successful")})
.catch(err => console.log(err));

// flash- one time display in screen after new user.
// cookies session ko track karti hai
// cookies me date ko save karti hai ki login kitne din tak rahega

// for connec-session
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,   // after login
 });

 store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
 });
 

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
 };
//  app.get("/",(req,res)=>{
//     res.send("root is working");
//   });

 app.use(session(sessionOption));
 app.use(flash());

 //Authentication from npm library{
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser()); 
 passport.deserializeUser(User.deserializeUser());
 // }
 // flash
app.use((req,res,next)=>{
  res.locals.success =  req.flash("success");
  res.locals.error  = req.flash("error");
  res.locals.currUser = req.user; // access in navbar ejs 
    next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use((req, res, next) => {
  next(new expressError(404, "Page Not Found!"));
});

// // Central Error Handling Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080,() =>{
    console.log("server is start ");
});