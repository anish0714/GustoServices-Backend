const mongoose = require("mongoose");
const config = require("./config");

module.exports = (app) => {
  mongoose
    .connect(config.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then((res) => console.log("connected to mongoDB..."))
    .catch((err) => console.log(err));
  mongoose.Promise = global.Promise;
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("SIGHUP", cleanup);
  if (app) {
    app.set("mongoose", mongoose);
  }
};
function cleanup() {
  mongoose.connection.close(function () {
    process.exit(0);
  });
}
