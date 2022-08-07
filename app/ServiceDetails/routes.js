const router = require("express").Router();
const controller = require("./controller");

router.get("/:userId", controller.getAllBookings);
router.get("/id/:serviceDetailId", controller.getBookingById);

router.post("/add-booking", controller.addBooking);
router.put("/close-booking/:serviceId", controller.closeBooking);

module.exports = router;
