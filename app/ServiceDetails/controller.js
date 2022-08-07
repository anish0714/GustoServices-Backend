const VendorService = require("../VendorService/model");
const ServiceDetails = require("./model");

// add booking to the profile
exports.addBooking = async (req, res) => {
  try {
    let serviceDetails = req.body;
    const serviceData = new ServiceDetails(serviceDetails);
    const selectedDate = serviceDetails.selectedDate;
    const selectedTime = serviceDetails.selectedTime;
    const { vendorId, serviceId } = serviceDetails;
    VendorService.findOne({ vendorId, serviceId })
      .lean()
      .exec((err, data) => {
        if (err) {
          res.status(500).json({
            error: err,
          });
        }
        data.schedule.forEach((scheduleData) => {
          const scheduleDate = getDate(scheduleData.date);
          const date = getDate(selectedDate);

          if (scheduleDate == date) {
            scheduleData.timings.forEach(async (time) => {
              if (time.time == selectedTime) {
                if (time.status != "booked") {
                  time.status = "booked";
                  VendorService.findOneAndUpdate({ _id: data._id }, data, {
                    upsert: true,
                    new: true,
                  }).exec((err, schedule) => {
                    if (err) {
                      res.status(500).json({
                        error: err,
                      });
                    }
                  });

                  await serviceData.save();
                  res.status(201).json({
                    data: serviceData,
                    message: "Booking placed successfully!",
                  });
                  return;
                } else {
                  res.status(500).json({
                    error: "Vendor already has a service booked",
                  });
                }
              }
            });
          }
        });
      });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// close booking
exports.closeBooking = async (req, res) => {
  try {
    let serviceId = req.params.serviceId;
    ServiceDetails.updateOne(
      { _id: serviceId },
      { $set: { status: "closed" } }
    ).exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      res.status(201).json({
        message: "Booking closed successfully!",
      });
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

function getDate(date) {
  return new Date(date).toString().split(" ").slice(0, 4).join(" ");
}

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