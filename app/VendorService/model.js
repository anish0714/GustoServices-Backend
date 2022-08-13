const mongoose = require("mongoose");

STATUS = {
  AVAILABLE: "available",
  UNAVAILABLE: "unavailable",
  BOOKED: "booked",
};

const vendorServiceSchema = mongoose.Schema({
  serviceName: {
    type: String,
  },
  schedule: [
    {
      date: {
        type: Date,
      },
      timings: [
        {
          id: {
            type: String,
          },
          time: { type: String },
          status: {
            type: String,
            enum: [STATUS],
          },
        },
      ],
    },
  ],
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rate: {
    type: Number,
    required: true,
  },

  organizationName: {
    type: String,
    required: true,
  },

  bio: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },
  // serviceImage: {
  //   type: String,
  //   required: true,
  // },
});

const VendorService = mongoose.model("VendorService", vendorServiceSchema);
module.exports = VendorService;
