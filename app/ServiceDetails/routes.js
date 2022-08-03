const router = require("express").Router();
const controller = require("./controller");

router.get("/:userId", controller.getAllBookings);
router.get("/id/:serviceDetailId", controller.getBookingById);

router.post("/add-booking", controller.addBooking);

module.exports = router;
