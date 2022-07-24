const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use("/images/Category", express.static("images/Category"));
app.use("/images/Profile", express.static("images/Profile"));
app.use("/images/Service", express.static("images/Service"));
// Connect Database
require("./config/db")(app);

// Init Middleware
app.use(express.json({ extended: false }));

// Initial route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Gusto Services API" });
});

// Define Routes
require("./app/routeHandler")(app);

// port
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Gusto services is running on PORT ${PORT}`);
});
