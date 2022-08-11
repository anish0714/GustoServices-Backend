const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema([
  {
    customerId: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cards: [
      {
        token: {
          type: String,
          required: true,
        },
        cardId: {
          type: String,
          required: true,
        },
        cardNumber: {
          type: String,
          required: true,
        },
      },
    ],
  },
]);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
