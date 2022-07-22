const mongoose = require("mongoose");
const Service = require("../Service/model");
const User = require("../User/model");

const feedbackSchema = mongoose.Schema({
  rating: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  date: {
    type: String,
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Service,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
