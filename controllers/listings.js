const Listing = require("../models/listing");


// module.exports.index = async (req,res)=>{
//    const allListings= await Listing.find({});
//   res.render("listings/index.ejs",{allListings});
//    const { country, minPrice, maxPrice } = req.query;
//   let filter = {};
//   if(filter !={}){
//   if (country) filter.country = country;
//   if (minPrice || maxPrice) {
//     filter.price = {};
//     if (minPrice) filter.price.$gte = minPrice;
//     if (maxPrice) filter.price.$lte = maxPrice;
   
//   }
//   const listings = await Listing.find(filter);
//  return res.render("listings/index.ejs", { listings });
// }
 
// };



module.exports.index = async (req, res) => {
  
  const { country, minPrice, maxPrice } = req.query;
  let filter = {};

  if (country) filter.country = country;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  try {
    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", { allListings });
    
  } catch (err) {
    console.error(err);
    req.flash("error", "Could not load listings");
    res.redirect("/");
  }
};


module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
};

module.exports.showListing = async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
    populate: {
      path: "author",
    },
  })
    .populate("owner");
    if(!listing){
         req.flash("error", "Listing you requested for does not exist!");
         return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async(req, res, next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     newListing.image = { url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
     res.redirect("/listings");
     
};

module.exports.renderEditForm = async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
         req.flash("error", "Listing you requested for does not exist!");
         return res.redirect("/listings");
    }
   
    let originalImageUrl =listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")

    res.render("listings/edit.ejs", {listing, originalImageUrl});
    
    
};

module.exports.searchResult = async (req, res) => {
  const { q } = req.query;
  try {
    const listings = await Listing.find({ 
      $text: { $search: q } 
    });
    res.render("listings/index", { allListings: listings });
  } catch (err) {
    console.error(err);
    req.flash("error", "Search failed");
    res.redirect("/listings");
  }
};

// module.exports.updateListing = async (req,res)=>{
     
//   let {id}=req.params;
// let { title, description, image, price, location, country } = req.body.listing;

// let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

// if(typeof req.file != "undefined"){
// let url = req.file.path;
// let filename = req.file.filename;
// listing.image ={url, filename};
// await listing.save();
// }

//  req.flash("success", " Listing Updated!");
//  res.redirect(`/listings/${id}`);
 
// };

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);

  Object.assign(listing, req.body.listing);

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  // // Explicitly ensure contactNumber is updated
  // if (req.body.listing.contactNumber) {
  //   listing.contactNumber = req.body.listing.contactNumber;
  // }

  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} =req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success", " Listing Deleted!");
   res.redirect("/listings");
};


module.exports.filterListings = async (req, res) => {
  const { category } = req.query; // e.g. ?category=rooms
  let  allListings ;

  

  if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings  = await Listing.find({});
  }

  res.render("listings/index.ejs", {  allListings , category });
};