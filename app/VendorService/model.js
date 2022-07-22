const mongoose = require("mongoose");
const Schedule = require("../Schedule/model");
const Service = require("../Service/model");
const User = require("../User/model");

const vendorServiceSchema = mongoose.Schema({
  
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Schedule,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Service,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  rate: {
    type: String,
    required: true,
  },
});

const VendorService = mongoose.model("VendorService", vendorServiceSchema);
module.exports = VendorService;
