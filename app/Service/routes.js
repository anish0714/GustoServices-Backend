const router = require("express").Router();
const controller = require("./controller");
const upload = require("../../middleware/upload");

router.get("/", controller.fetchAllServices);
router.get("/search/:searchKeyword", controller.getServiceBySearch);
router.get("/vendor/:serviceId", controller.getVendorsByService);
router.get("/:id", controller.fetchServiceById);

router.post(
  "/addService",
  upload.single("serviceImage"),
  controller.addService
);

router.delete("/removeService/:id", controller.removeService);

module.exports = router;
