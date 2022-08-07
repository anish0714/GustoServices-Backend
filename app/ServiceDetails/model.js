const mongoose = require("mongoose");

const serviceDetailsSchema = mongoose.Schema({
  totalPrice: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    required: true,
    default: "open",
  },
  selectedDate: {
    type: Date,
    required: true,
  },
  selectedTime: {
    type: String,
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const ServiceDetails = mongoose.model("ServiceDetails", serviceDetailsSchema);
module.exports = ServiceDetails;
