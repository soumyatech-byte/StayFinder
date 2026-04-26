const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.renderBookingForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("bookings/new.ejs", { listing });

};

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, guests } = req.body;

  const booking = new Booking({
    listing: id,
    user: req.user._id,
    checkIn,
    checkOut,
    guests
  });

  await booking.save();
  req.flash("success", "Booking confirmed!");
  res.redirect("/my-bookings");
};

module.exports.showUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("listing");
  if(bookings.length == 0){
     req.flash("error","You have no bookings");
    
  }
  res.render("bookings/index.ejs", { bookings });
  
};

module.exports.deleteBooking = async (req, res) => {
  const { id, bookingId } = req.params;
  await Booking.findByIdAndDelete(bookingId);
  req.flash("success", "Booking cancelled successfully");
  res.redirect("/my-bookings");
};

