const ServiceModel = require("./model");
const CategoryModel = require("../Category/model");
const VendorService = require("../VendorService/model");

exports.addService = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    let categories = await CategoryModel.findById(categoryId);
    if (!categories) {
      return res.status(200).json({
        status: true,
        statusCode: 1,
        data: "Category not found",
      });
    }

    if (!req.file) {
      return res.status(200).json({
        status: true,
        statusCode: 1,
        data: "Please attach image in proper format",
      });
    }
    const { filename, destination, mimetype } = req.file;
    console.log(destination + filename);

    const service = new ServiceModel({
      name,
      categoryId,
      serviceImage: `images/Service/${filename}`,
    });

    service.save();

    return res.status(200).json({
      status: true,
      statusCode: 0,
      data: "Service added successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
      status: false,
      statusCode: 1,
      data: "Server error",
    });
  }
};

//  @type DELETE
//  @desc remove a existing service
exports.removeService = async (req, res) => {
  try {
    const { id } = req.params;
    let service = await ServiceModel.findByIdAndRemove(id);
    if (!service) {
      return res.status(200).json({
        status: true,
        statusCode: 1,
        data: "Please include a valid id",
      });
    }
    return res.status(200).json({
      status: true,
      statusCode: 0,
      data: "service removed",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
      status: false,
      statusCode: 1,
      data: "Server error",
    });
  }
};

//  @type GET
//  desc get all services
exports.fetchAllServices = async (req, res) => {
  try {
    let services = await ServiceModel.find();
    return res.status(200).json({
      status: true,
      statusCode: 0,
      data: services,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      statusCode: 1,
      data: "Server error",
    });
  }
};

//  @type GET
//  desc get service by id
exports.fetchServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    let service = await ServiceModel.findById(id);
    return res.status(200).json({
      status: true,
      statusCode: 0,
      data: service,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      statusCode: 1,
      data: "Server error",
    });
  }
};

exports.getVendorsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    let service = await VendorService.find({ serviceId }).populate(
      "vendorId",
      "fullName email organizationName"
    );
    return res.status(200).json({
      status: true,
      statusCode: 0,
      data: service,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
      status: false,
      statusCode: 1,
      data: "Server error",
    });
  }
};
