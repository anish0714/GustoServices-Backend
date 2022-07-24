const CategoryModel = require("./model");
const ServiceModel = require("../Service/model");
const fs = require("fs");
//  @type POST
//  @desc add a new Category
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(req.file);

    if (!req.file) {
      return res.status(200).json({
        status: true,
        statusCode: 1,
        data: "Please attach image in proper format",
      });
    }
    const { filename, destination, mimetype } = req.file;
    console.log(destination + filename);

    const category = new CategoryModel({
      name,
      categoryImage: `images/Category/${filename}`,
    });
    category.save();
    return res.status(200).json({
      status: true,
      statusCode: 0,
      data: "Category added successfully",
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
//  @desc remove a existing Category
exports.removeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let categories = await CategoryModel.findByIdAndRemove(id);
    if (!categories) {
      return res.status(200).json({
        status: true,
        statusCode: 1,
        data: "Please include a valid id",
      });
    }
    let service = await ServiceModel.findByIdAndDelete(id);

    return res.status(200).json({
      status: true,
      statusCode: 0,
      data: "category removed",
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
//  desc get all categories
exports.fetchAllCategories = async (req, res) => {
  try {
    let categories = await CategoryModel.find();
    return res.status(200).json({
      status: true,
      statusCode: 0,
      data: categories,
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
//  desc get category by id
exports.fetchCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    let categories = await CategoryModel.findById(id);
    return res.status(200).json({
      status: true,
      statusCode: 0,
      data: categories,
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
