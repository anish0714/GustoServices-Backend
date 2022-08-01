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
  feedbackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback",
  },
  rate: {
    type: Number,
    required: true,
  },
});

const VendorService = mongoose.model("VendorService", vendorServiceSchema);
module.exports = VendorService;
