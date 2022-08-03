const router = require("express").Router();
const controller = require("./controller");

router.post("/", controller.getVendorServices);
router.get("/:vendorServiceId", controller.getVendorServiceById);

router.post("/add", controller.addOrUpdateService);

router.delete("/remove/:vendorServiceId", controller.deleteVendorServices);

module.exports = router;