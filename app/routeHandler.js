const userRoutes = require("./User/routes");
const serviceRoutes = require("./Service/routes");
const categoryRoutes = require("./Category/routes");

module.exports = (app) => {
  //-------------------------------------USER---
  app.use("/user", userRoutes);
  app.use("/category", categoryRoutes);
  app.use("/service", serviceRoutes);
  
};
