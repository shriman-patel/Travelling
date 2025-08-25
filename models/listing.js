const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type: String,
        required:true
    },
    description: String,
    image:{
        type: String,
         default:"https://unsplash.com/photos/a-delicate-pink-lotus-flower-blooms-amidst-green-leaves-bX_sZ5_6ySE",
        set: (v)=> v==="" ? "https://unsplash.com/photos/a-delicate-pink-lotus-flower-blooms-amidst-green-leaves-bX_sZ5_6ySE"
         : v,
    },
    price: Number,
    location:String,
    country:String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    // for Autherize
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

 listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
    await Review.deleteMany({_id : {$in: listing.review}});
    }
});

 const Listing = mongoose.model("Listing", listingSchema);
 module.exports = Listing;