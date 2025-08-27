const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
 const listingController = require("../controllers/listings");
 // cloudinary 
 const {storage} =  require("../cloudConfig");
 // for image storage
const multer  = require('multer');
const upload = multer({ storage });

 // router . route // index routes // create route
 router.route("/")
 .get(wrapAsync(listingController.index))
 .post(isLoggedIn,
   upload.single("listing[image]"),
    validateListing,
   wrapAsync(listingController.createListing)
);


 router.get("/new", isLoggedIn,listingController.renderNewForm);
//new route //show route // update router // deleet routr
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// edit router
router.get( "/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing))
module.exports = router;
