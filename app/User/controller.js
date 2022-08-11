const UserModel = require("./model");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const sendEmail = require("../../config/email");
const otpGenerator = require("otp-generator");

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
        statusCode: 2,
      });
    } else {
      const { email, password } = req.body;
      try {
        let user = await UserModel.findOne({ email });
        if (user) {
          res.status(200).json({
            status: true,
            data: "User already exists",
            statusCode: 1,
          });
        } else {
          user = new UserModel(req.body);
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
          await user.save();
          // const payload = {
          //   user: {
          //     id: user.id,
          //   },
          // };

          res.status(200).json({
            status: true,
            data: "User Added Successfully",
            statusCode: 0,
          });

          //  Token Valid for 1hr
          // jwt.sign(
          //   payload,
          //   config.JWT_SECRET,
          //   {
          //     expiresIn: 3600,
          //   },
          //   (err, token) => {
          //     if (err) {
          //       throw err;
          //     } else {
          //       res.status(200).json({
          //         status: true,
          //         data: "User Added Successfully",
          //         statusCode: 0,
          //       });
          //     }
          //   }
          // );
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({
          status: false,
          error: err,
          statusCode: 2,
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
      res.status(200).json({
        error: errors.array(),
        status: true,
        data: "Invalid credientials",
        statusCode: 1,
      });
    } else {
      const { email, password } = req.body;

      try {
        let user = await UserModel.findOne({ email });

        if (!user) {
          return res.status(200).json({
            status: true,
            data: "Invalid credientials",
            statusCode: 1,
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(200).json({
            status: true,
            data: "Invalid credientials",
            statusCode: 1,
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
                data: user,
                token: token,
                statusCode: 0,
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
    res.status(200).json({
      status: true,
      statusCode: 0,
      user,
    });
  } catch (err) {
    res.status(200).json({
      status: false,
      data: "Token expired or invalid",
      statusCode: 1,
    });
  }
};

exports.updateProfilePic = async (req, res) => {
  // const { id } = req.params;
  const { userId } = req.body;
  console.log("userId", userId);
  const { filename } = req.file;
  const payload = {
    profilePic: `images/Profile/${filename}`,
  };
  // console.log("req.file", req.file);
  UserModel.findByIdAndUpdate(userId, payload, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: `User not found with id: ${userId}`,
        });
      }
      console.log("USER", user);
      return res.status(200).json({
        status: true,
        statusCode: 0,
        userData: user,
      });
    })
    .catch((err) => {
      res.status(200).json({
        status: false,
        data: "ERROR WHILE UPDATING IMAGE",
        statusCode: 1,
      });
    });
};

exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  console.log("req.body", req.body);
  console.log("userId", userId);
  UserModel.findByIdAndUpdate(userId, req.body, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: `User not found with id: ${userId}`,
        });
      }
      console.log("USER", user);
      return res.status(200).json({
        status: true,
        statusCode: 0,
        userData: user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        data: "ERROR WHILE UPDATING PROFILE",
        statusCode: 1,
      });
    });
};

exports.updatePassword = async (req, res) => {
  try {
    let otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    UserModel.updateOne(
      { email: req.body.email },
      { $set: { otp } },
      async (err, user) => {
        if (err) {
          res.send(err);
        }
        await sendEmail(req.body.email, "Password reset", otp);
        res.status(200).json({
          success: true,
          message: "Reset link sent via mail",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { password, otp } = req.body;
    if (!password) {
      res.send("New password not sent");
    }
    const user = await UserModel.findById(req.params.userId);
    if (!user) return res.status(400).send("invalid link or expired");

    if (otp != user.otp) {
      return res.status(400).json({
        success: false,
        data: "Incorrect otp",
      });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.otp = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "password reset sucessfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error,
    });
  }
};
