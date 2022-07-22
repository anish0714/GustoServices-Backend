const router = require("express").Router();
const controller = require("./controller");
const upload = require("../../middleware/upload");

router.get("/", controller.fetchAllCategories);
router.get("/:id", controller.fetchCategoryById);

router.post(
  "/addCategory",
  upload.single("categoryImage"),
  controller.addCategory
);

router.delete("/removeCategory/:id", controller.removeCategory);

module.exports = router;
