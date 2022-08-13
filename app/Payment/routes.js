const router = require("express").Router();
const controller = require("./controller");

router.get("/:userId", controller.getAllCards);

router.post("/accept-payment", controller.acceptPayment);
router.post("/add-card", controller.addCard);

router.delete("/remove", controller.deleteCard);

module.exports = router;
