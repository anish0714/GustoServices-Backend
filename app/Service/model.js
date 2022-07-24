const mongoose = require("mongoose");
const Category = require("../Category/model");

const serviceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  serviceImage: {
    type: String,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Category,
  },
});

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
