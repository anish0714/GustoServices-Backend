const router = require("express").Router();
const controller = require("./controller");

router.get("/id/:feedbackId", controller.getFeedbackById);
router.get(
  "/userid/:userId/:vendorId/:serviceId",
  controller.getFeedbackByUserId
);
router.get("/:vendorId/:serviceId", controller.getAllFeedbacks);

router.post("/", controller.addOrUpdateFeedback);

router.delete("/remove/:id", controller.removeFeedback);

module.exports = router;
