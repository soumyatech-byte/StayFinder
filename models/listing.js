const mongoose = require('mongoose');
const Review = require("./review.js");

const Schema= mongoose.Schema;

const listingSchema = new Schema({
    title:{type: String,
         required:true,
    },
    description: String,
    
    image: {
    url: String,
    filename:String,
},
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    
    category: {
    type: String,
    enum: [
      "trending",
      "rooms",
      "cities",
      "mountains",
      "castles",
      "pools",
      "camping",
      "farms",
      "arctic",
      "domes",
      "boats"
    ],
    required: true
  },
  contactNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/ // simple validation for 10‑digit phone numbers
  },
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews }});
    }
})

listingSchema.index({ title: "text", location: "text" });


const Listing =mongoose.model('Listing',listingSchema);
module.exports=Listing;

