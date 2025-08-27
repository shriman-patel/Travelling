const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title:{
        type: String,
        required:true
    },
    description: String,
    image:{
      url: String,
      filename: String,
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

 geometry: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  // category:{  // for future
  //     type: String,
  //     enum: ["mountains", "arctic"],  
  //   },

});

 listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
    await Review.deleteMany({_id : {$in: listing.review}});
    }
    
});

 const Listing = mongoose.model("Listing", listingSchema);
 module.exports = Listing;