const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");
  // Check if not token
  if (!token) {
    return res.status(401).json({
      data: "No token - authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded.user;
    console.log(`req.user : ${JSON.stringify(req.user)}`);
    next();
  } catch (err) {
    res.status(401).json({
      data: "Token is not valid",
    });
  }
};
