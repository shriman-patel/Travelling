const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema");
const Review = require("./models/review");

const expressError =  require("./utils/expressError");

module.exports.isLoggedIn = (req,res,next) => {
// check user logeed aor not {
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in create listing");
       return  res.redirect("/login");
    }  // }
    next();
};

// for authorization {
module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params; 
let listing = await Listing.findById(id).populate("owner");
if (!listing.owner._id.equals(res.locals.currUser._id)) {
  req.flash("error", "You Are Not the Owner of this Listing");
  return res.redirect(`/listings/${id}`);
}
next();
};

//server side validation  for reviews
module.exports.validateListing  = async(req,res,next)=>{

let {error} = listingSchema.validate(req.body); // schema Validate
if(error){
  let errMsg =  error.details.map((el) => el.message).join(",");
  throw new expressError(400,error);
}else{
  next();
}
};

module.exports.validateReview = async(req,res,next)=>{
let {error} = reviewSchema.validate(req.body); // schema Validate
if(error){
  let errMsg =  error.details.map((el) => el.message).join(",");
  throw new expressError(400,error);
}else{
  next();
}
};

// delete review 
module.exports.isReviewAuthor = async(req,res,next)=>{
let { id, reviewId } = req.params; 
let review  = await Review.findById(reviewId);
if (!review.author.equals(res.locals.currUser._id)) {
  req.flash("error", "You Did Not Create This Review");
  return res.redirect(`/listings/${id}`);
}
next();
};