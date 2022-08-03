const ServiceDetails = require("./model");

// add booking to the profile
exports.addBooking = async (req, res) => {
  try {
    let serviceDetails = req.body;
    const serviceData = new ServiceDetails(serviceDetails);
    await serviceData.save();
    res.status(201).json({
      data: serviceData,
      message: "Booking placed successfully!",
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// get all bookings linked to the vendor/customer
exports.getAllBookings = async (req, res) => {
  try {
    let userId, vendorId;
    userId = vendorId = req.params.userId;
    ServiceDetails.find({ $or: [{ userId: userId }, { vendorId: vendorId }] })
      .populate("userId", "fullName email")
      .populate("vendorId", "fullName email organizationName")
      .populate("serviceId", "name")
      .exec((err, services) => {
        if (err) {
          res.status(500).json({
            error: err,
          });
        }
        res.send(services);
      });
  } catch (err) {
    return res.status(500).json({
      status: false,
      statusCode: 1,
      data: "Server error",
    });
  }
};

// get a particular booking by id
exports.getBookingById = async (req, res, next) => {
  try {
    ServiceDetails.findById(req.params.serviceDetailId)
      .populate("userId", "fullName email")
      .populate("vendorId", "fullName email organizationName")
      .populate("serviceId", "name")
      .exec((err, service) => {
        if (err) {
          res.status(500).json({
            error: err,
          });
        }
        res.send(service);
      });
  } catch (err) {
    return res.status(500).json({
      status: false,
      statusCode: 1,
      data: "Server error",
    });
  }
};
