const router = require("express").Router();
const controller = require("./controller");
const upload = require("../../middleware/upload");

router.post("/", controller.getVendorServices);
router.get("/:vendorServiceId", controller.getVendorServiceById);

router.post("/add", upload.single("serviceImage"), controller.addOrUpdateService);

router.delete("/remove/:vendorServiceId", controller.deleteVendorServices);

module.exports = router;
