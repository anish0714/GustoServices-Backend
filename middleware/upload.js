const multer = require("multer");
// require('../uploads')
const path = require("path");
console.log("file path -->", path.resolve("./images/Category/"));
// const filepath = "./images/Category/";

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const { baseUrl } = req;
    const filePath =
      baseUrl === "/category"
        ? "./images/Category/"
        : baseUrl === "/user"
        ? "./images/Profile/"
        : "./images/Service/";
    console.log(req.body);
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({
  storage: fileStorageEngine,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
