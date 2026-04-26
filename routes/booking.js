const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const bookingController = require("../controllers/booking.js");

// Render booking form
router.get("/new", isLoggedIn, wrapAsync(bookingController.renderBookingForm));

// Create booking
router.post("/", isLoggedIn, wrapAsync(bookingController.createBooking));

// Show all bookings for current user
router.get("/my-bookings", isLoggedIn, wrapAsync(bookingController.showUserBookings));

//Delete bookings
router.delete("/:bookingId", isLoggedIn, wrapAsync(bookingController.deleteBooking));


module.exports = router;
