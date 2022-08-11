const Payment = require("./model");
const ServiceDetails = require("../ServiceDetails/model");

const stripe = require("stripe")(process.env.SECRET_KEY);

// accept payment
exports.acceptPayment = async (req, res) => {
  try {
    stripe.charges
      .create({
        amount: req.body.amount,
        description: req.body.description,
        currency: "CAD",
        customer: req.body.customerId,
        source: req.body.cardId,
      })
      .then((charge) => {
        ServiceDetails.updateOne(
          ({ _id: req.body.bookingId },
          {
            $set: {
              paymentStatus: "paid",
              transactionId: charge.balance_transaction,
              receiptUrl: charge.receipt_url,
            },
          }),
          (err, service) => {
            if (err) {
              res.send(err);
            }
            return res.status(200).json({
              status: true,
              statusCode: 1,
              data: charge,
            });
          }
        );
      })
      .catch((err) => {
        res.send(err); // If some error occurs
      });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

// add a new card
exports.addCard = async (req, res) => {
  var token;
  // create a token for the card
  stripe.tokens.create(
    {
      card: {
        number: req.body.cardNumber,
        exp_month: req.body.month,
        exp_year: req.body.year,
        cvc: req.body.cvc,
      },
    },
    (err, cardToken) => {
      try {
        token = cardToken.id;
        if (!req.body.customerId) {
          // create a new customer
          stripe.customers
            .create({
              email: req.body.email,
              source: token,
              name: req.body.holderName,
            })
            .then(async (customer) => {
              let paymentDetails = req.body;
              paymentDetails.customerId = customer.id;
              const cardNumber = req.body.cardNumber.slice(-4);
              const cardId = cardToken.card.id;
              paymentDetails.cards = [];
              paymentDetails.cards.push({ token, cardNumber, cardId });
              const serviceData = new Payment(paymentDetails);
              await serviceData.save();
            })
            .then((charge) => {
              return res.status(200).json({
                status: true,
                statusCode: 1,
                data: charge,
              });
            })
            .catch((err) => {
              res.send(err);
            });
        } else {
          // link card with the customer
          stripe.customers.createSource(
            req.body.customerId,
            {
              source: token,
            },
            (err, card) => {
              if (err) res.send(err);
              const cardNumber = req.body.cardNumber.slice(-4);
              const cardId = card.id;
              const cardDetails = { token, cardNumber, cardId };
              Payment.findOneAndUpdate(
                { customerId: req.body.customerId },
                { $push: { cards: cardDetails } },
                { new: true }
              )
                .lean()
                .exec((err, payment) => {
                  if (err) {
                    res.status(500).json({
                      error: err,
                    });
                  }
                  return res.status(200).json({
                    status: true,
                    statusCode: 1,
                    data: payment,
                  });
                });
            }
          );
        }
      } catch {
        res.send(err);
      }
    }
  );
};

// fetch all customer cards
exports.getAllCards = async (req, res) => {
  stripe.customers.listSources(
    req.params.customerId,
    {
      object: "card",
      limit: 3,
    },
    (err, cards) => {
      if (err && err.message) return res.send(err.message);
      return res.status(200).json({
        status: true,
        statusCode: 1,
        data: cards,
      });
    }
  );
};

// delete the card
exports.deleteCard = async (req, res) => {
  stripe.customers.deleteSource(
    req.body.customerId,
    req.body.cardId,
    (err, deleted) => {
      if (err) {
        return res.status(404).json({
          error: err.message,
          status: false,
        });
      }
      Payment.updateOne(
        { customerId: req.body.customerId },
        {
          $pull: {
            cards: { cardId: req.body.cardId },
          },
        },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            return res.status(200).json({
              status: true,
              statusCode: 1,
              data: deleted,
            });
          }
        }
      );
    }
  );
};
