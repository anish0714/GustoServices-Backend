const router = require("express").Router();
const controller = require("./controller");

router.get("/:scheduleId", controller.getScheduleById);

router.post("/add", controller.addSchedule);

router.put("/:scheduleId", controller.updateSchedule);

module.exports = router;
