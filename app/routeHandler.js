const userRoutes = require("./User/routes");
const serviceRoutes = require("./Service/routes");
const scheduleRoutes = require("./Schedule/routes");
const categoryRoutes = require("./Category/routes");
const vendorServiceRoutes = require("./VendorService/routes");
const serviceDetailRoutes = require("./ServiceDetails/routes");

module.exports = (app) => {
  //-------------------------------------USER---
  app.use("/user", userRoutes);
  app.use("/category", categoryRoutes);
  app.use("/service", serviceRoutes);
  app.use("/schedule", scheduleRoutes);
  app.use("/vendor/service", vendorServiceRoutes);
  app.use("/booking", serviceDetailRoutes);
};
