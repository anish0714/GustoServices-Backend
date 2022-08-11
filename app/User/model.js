const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  bio: {
    type: String,
  },
  city: {
    type: String,
  },
  organizationName: {
    type: String,
  },
  otp: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  userType: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
