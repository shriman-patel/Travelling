const express = require("express");
const router =  express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsyc");
const Listing =  require("../models/listing");
const expressError =  require("../utils/expressError");
const Review = require("../models/review");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const reviewController = require("../controllers/reviews");
// reviews
// create reviews.js
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.reviews));


// Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;