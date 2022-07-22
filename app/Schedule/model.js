const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema({
  timeAndDate: {
    type: Array,
    required: true,
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
