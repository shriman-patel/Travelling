const express = require("express");
const router =  express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsyc");
const Listing =  require("../models/listing");
const expressError =  require("../utils/expressError");
const Review = require("../models/review");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");

// reviews
// reviews.js
router.post("/",isLoggedIn,validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new expressError(404, "Listing not found");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
   req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}));


// Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
let {id , reviewId} = req.params; 
await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
await Review.findByIdAndDelete(reviewId);
req.flash("success", "Review Deleted!");
res.redirect(`/listings/${id}`);
}));

module.exports = router;