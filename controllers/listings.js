const Listing = require("../models/listing")
 
// index routes
module.exports.index = async (requestAnimationFrame,res)=>{
    const  listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
};

//new route
module.exports.renderNewForm =   (req, res) => {
  res.render("listings/new.ejs");
};

// show router
module.exports.showListing = async(req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({path: "reviews",populate: {
          path: "author",
    },
  })
    .populate("owner"); // use populate disply reviews with author in screen  and owner
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// create route
module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "new Listing Created!");
    res.redirect("/listings");
  };

  // edit route
  module.exports.editListing = async (req, res) => {
      const { id } = req.params;
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
      }
      res.render("listings/edit.ejs", { listing });
    };

    // update route
    module.exports.updateListing = async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
      };

      // delete route
      module.exports.deleteListing = async (req, res) => {
          let { id } = req.params;
          let deletedListing = await Listing.findByIdAndDelete(id);
          console.log(deletedListing);
          req.flash("success", "Listing Deleted!");
          res.redirect("/listings");
        };