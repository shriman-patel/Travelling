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
 try{
    const { location } = req.body.listing;

    // 1. Geocode location using Nominatim
    let response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    );
    let data = await response.json();
    let geometry = null;
    if (data.length > 0) {
      geometry = {
        type: "Point",
        coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
      };
    }
  
 
  let url = req.file.path;
  let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
      if (geometry) {
      newListing.geometry = geometry;   // 👈 yaha add karna zaroori hai
    }
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "new Listing Created!");
    res.redirect("/listings");
 
     } catch (err) {
    next(err);
  }
  };

  // edit route
  module.exports.editListing = async (req, res) => {
      const { id } = req.params;
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
      }
      let originalImageUrl = listing.image.url;
      originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
      res.render("listings/edit.ejs", { listing, originalImageUrl });
    };

    // update route
    module.exports.updateListing = async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        if(typeof req.file !== "undefined")
          {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url,filename };
        await listing.save();
        }
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