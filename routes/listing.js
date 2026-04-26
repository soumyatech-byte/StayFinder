const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing= require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



router
.route("/")
.get( wrapAsync(listingController.index))

.post(
    isLoggedIn, 
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);


// Search route 
router.get("/search", wrapAsync(listingController.searchResult));




//new route
router.get("/new",  isLoggedIn, listingController.renderNewForm);

//filter route(trending)
router.get("/filter", wrapAsync(listingController.filterListings)); //filters (trending, rooms)

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
     upload.single('image'),
    validateListing,
    wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);


//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



// router.get("/", async (req, res) => {

//     console.log(req);
//   const { country, minPrice, maxPrice } = req.query;
//   let filter = {};
//   if (country) filter.country = country;
//   if (minPrice || maxPrice) {
//     filter.price = {};
//     if (minPrice) filter.price.$gte = minPrice;
//     if (maxPrice) filter.price.$lte = maxPrice;
//   }
//   const listings = await Listing.find(filter);
//   res.render("listings/index", { listings });
// });







module.exports = router;