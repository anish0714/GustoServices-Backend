const VendorService = require("./model");
const Service = require("../Service/model");
const mongoose = require("mongoose");
// const Schedule = require("../Schedule/model");

exports.addOrUpdateService = async (req, res) => {
  // check if the service exists
  Service.findById(req.body.serviceId, (error, service) => {
    // service is added to the system
    if (service != null) {
      let vendorServiceId = new mongoose.mongo.ObjectID();
      if (req.body._id) vendorServiceId = req.body._id;
      // look for the vendor and add or update the details
      VendorService.findOneAndUpdate({ _id: vendorServiceId }, req.body, {
        upsert: true,
        new: true,
      })
        .exec()
        .then(async (vendorService) => {
          if (!vendorService) {
            // add service to the profile
            const vendorServiceData = new VendorService(vendorService);
            try {
              await vendorServiceData.save();
            } catch (err) {
              res.status(500).send(err.message);
            }
          }
          res.status(201).json({
            data: vendorService,
            message: "Service added to the profile!",
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    } else {
      res.status(500).json({
        error: "No such service exists",
      });
    }
  });
};

// get all services linked to the vendor
exports.getVendorServices = async (req, res) => {
  try {
    const vendorId = req.body.vendor_id;
    VendorService.find({ vendorId })
      // .populate({
      //   path: "schedule",
      //   model: "Schedule",
      // })
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

// get a particular vendor service by id
exports.getVendorServiceById = async (req, res, next) => {
  try {
    VendorService.findById(req.params.vendorServiceId)
      // .populate({
      //   path: "schedule",
      //   model: "Schedule",
      // })
      .exec((err, vendorService) => {
        if (err) {
          res.status(500).json({
            error: err,
          });
        }
        res.send(vendorService);
      });
  } catch (err) {
    return res.status(500).json({
      status: false,
      statusCode: 1,
      data: "Server error",
    });
  }
};

// remove a particular service from vendor's profile
exports.deleteVendorServices = async (req, res, next) => {
  VendorService.findByIdAndRemove(
    { _id: req.params.vendorServiceId },
    (err, vendorService) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Cannot remove the Service from your profile" });
      }
      if (!vendorService) {
        return res.status(404).json({ message: "The service is not added!" });
      }
      res.status(200).json({ message: "Service removed from the profile" });
    }
  );
};
