const Feedback = require("./model");
const mongoose = require("mongoose");

// add or update feedback
exports.addOrUpdateFeedback = async (req, res) => {
  try {
    let { _id } = req.body;
    if (!_id) _id = new mongoose.mongo.ObjectID();
    Feedback.findOneAndUpdate({ _id }, req.body, {
      upsert: true,
      new: true,
    })
      .exec()
      .then(async (feedback) => {
        if (!feedback) {
          // add feedback to the service
          const feedbackData = new Feedback(feedback);
          try {
            await feedbackData.save();
          } catch (err) {
            res.status(500).send(err.message);
          }
        }
        res.status(201).json({
          data: feedback,
          message: "Feedback added successfully!",
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } catch (err) {
    return res.status(500).json({
      error: err,
      status: false,
      statusCode: 1,
      data: "Server error",
    });
  }
};

// remove the feedback
exports.removeFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    let feedback = await Feedback.findByIdAndRemove(id);
    if (!feedback) {
      return res.status(200).json({
        status: true,
        statusCode: 1,
        data: "Feedback not found",
      });
    }
    return res.status(200).json({
      status: true,
      statusCode: 0,
      data: "Feedback removed",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
      status: false,
      statusCode: 1,
      data: "Feedback not found",
    });
  }
};

// get all vendor feedbacks
exports.getAllFeedbacks = async (req, res) => {
  try {
    const { vendorId, serviceId } = req.params;
    let services = await Feedback.find({ vendorId, serviceId })
      .populate("userId", "fullName email")
      .populate("vendorId", "fullName email organizationName")
      .populate("serviceId", "name");
    return res.status(200).json({
      status: true,
      statusCode: 0,
      data: services,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      statusCode: 1,
      data: "Server error",
    });
  }
};

// get feedback by vendor id and service (for displaying feedbacks on vendor profile)
exports.getFeedbackById = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    let feedback = await Feedback.findById(feedbackId)
      .populate("userId", "fullName email")
      .populate("vendorId", "fullName email organizationName")
      .populate("serviceId", "name");
    if (!feedback) {
      return res.status(404).json({
        status: true,
        message: "Feedback not found",
      });
    }
    return res.status(200).json({
      status: true,
      data: feedback,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      statusCode: 1,
      data: "Server error",
    });
  }
};

// get feedback by user id
exports.getFeedbackByUserId = async (req, res) => {
  try {
    const { userId, vendorId, serviceId } = req.params;
    let feedback = await Feedback.find({ userId, vendorId, serviceId })
      .populate("userId", "fullName email")
      .populate("vendorId", "fullName email organizationName")
      .populate("serviceId", "name");
    if (!feedback) {
      return res.status(404).json({
        status: true,
        message: "Feedback not found",
      });
    }
    return res.status(200).json({
      status: true,
      data: feedback,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      statusCode: 1,
      data: "Server error",
    });
  }
};
