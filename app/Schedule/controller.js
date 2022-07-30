const Schedule = require("./model");

// add schedule
exports.addSchedule = async (req, res) => {
  try {
    const data = req.body;
    const schedule = new Schedule(data);

    try {
      await schedule.save();
      return res.status(200).json(schedule);
    } catch (err) {
      res.status(500).send(err.message);
    }
  } catch (err) {
    return res.status(500).json({
      error: err,
      status: false,
      statusCode: 1,
      data: "Server error",
    });
  }
};

// update schedule
exports.updateSchedule = async (req, res) => {
  try {
    Schedule.findByIdAndUpdate(req.params.scheduleId, req.body, { new: true })
      .then((schedule) => {
        if (!schedule) {
          return res.status(404).send({
            message: "Schedule not found with id " + req.params.scheduleId,
          });
        }
        res.status(200).json(schedule);
      })
      .catch((err) => {
        return res.status(500).send({
          message: "Error updating schedule with id " + req.params.scheduleId,
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

// get schedule by id
exports.getScheduleById = async (req, res) => {
  try {
    Schedule.findById(req.params.scheduleId).exec((err, schedule) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      res.send(schedule);
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      statusCode: 1,
      data: "Server error",
    });
  }
};
