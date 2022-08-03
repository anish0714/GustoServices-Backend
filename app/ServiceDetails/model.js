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
  feedbackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback",
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
