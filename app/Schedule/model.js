const mongoose = require("mongoose");

STATUS = {
  AVAILABLE: "available",
  UNAVAILABLE: "unavailable",
  BOOKED: "booked",
};

const scheduleSchema = mongoose.Schema([
  {
    date: {
      type: Date,
    },
    timings: [
      {
        // id: { type: Number, required: true },
        time: { type: String },
        status: {
          type: String,
          enum: [STATUS],
        },
      },
    ],
  },
]);

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
