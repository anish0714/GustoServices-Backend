const UserModel = require("./model");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");

// @type POST
// @desc register a user
// @access PUBLIC
exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    //console.log(`errors : ${JSON.stringify(errors)}`);
    //res.send(errors);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: errors.array(),
      });
    } else {
      const { name, email, password, contactNumber, address } = req.body;
      try {
        let user = await UserModel.findOne({ email });
        if (user) {
          res.status(400).json({
            status: true,
            data: "User already exists",
          });
        } else {
          user = new UserModel({
            name,
            email,
            password,
            contactNumber,
            address,
          });
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
          await user.save();
          const payload = {
            user: {
              id: user.id,
            },
          };
          //  Token Valid for 1hr
          jwt.sign(
            payload,
            config.JWT_SECRET,
            {
              expiresIn: 3600,
            },
            (err, token) => {
              if (err) {
                throw err;
              } else {
                res.status(200).json({
                  status: true,
                  data: "User Added Successfully",
                  token: token,
                });
              }
            }
          );
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({
          status: false,
          error: err,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      error: err,
    });
  }
};

// @type POST
// @desc User login
// @access PUBLIC
exports.userLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    //console.log(`errors : ${JSON.stringify(errors)}`);
    //res.send(errors);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: errors.array(),
      });
    } else {
      const { email, password } = req.body;

      try {
        let user = await UserModel.findOne({ email });

        if (!user) {
          return res.status(400).json({
            status: true,
            data: "Invalid credientials",
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({
            status: true,
            data: "Invalid credientials",
          });
        }

        const payload = {
          user: {
            id: user.id,
          },
        };
        // Token valid for 1hr
        jwt.sign(
          payload,
          config.JWT_SECRET,
          {
            expiresIn: 3600,
          },
          (err, token) => {
            if (err) {
              throw err;
            } else {
              res.status(200).json({
                status: true,
                data: "Login successful",
                token: token,
              });
            }
          }
        );
      } catch (err) {
        console.log(err);
        res.status(500).json({
          status: false,
          error: err,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      error: err,
    });
  }
};

// @type GET
// desc logged in user
// @access PRIVATE
exports.loggedInUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      status: false,
      data: "Token expired or invalid",
    });
  }
};
