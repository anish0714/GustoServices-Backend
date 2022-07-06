const userRoutes = require("./User/routes");

module.exports = (app) => {
  //-------------------------------------USER---
  app.use("/user", userRoutes);
};
