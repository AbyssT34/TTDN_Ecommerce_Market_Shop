import CategoryModel from "../models/category.model.js";

import { v2 as cloudinary } from "cloudinary";
import e from "express";
import fs from "fs";
import mongoose from "mongoose";

// Configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret, // Click 'View API Keys' above to copy your API secret
  secure: true,
});

//image upload
var imagesArr = [];
// image upload
export async function uploadImages(request, response) {
  try {
    const images = request.files; // nhiều file

    // ===========================
    // UPLOAD ẢNH MỚI
    // ===========================
    const imagesArr = [];

    for (const file of images) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });

      imagesArr.push(uploaded.secure_url);

      // Xóa file tạm
      fs.unlinkSync(file.path);
    }

    return response.status(200).json({
      avatar: imagesArr[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//create category
export async function createCategory(request, response) {
  try {
    // Validate name
    if (!request.body.name) {
      return response.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const files = request.files || [];
    const imagesArr = [];

    // ========== UPLOAD FILES ==========
    if (files.length > 0) {
      for (const file of files) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
          folder: "categories", // có thể bỏ nếu không muốn
        });

        console.log("Uploaded:", uploaded.secure_url);

        imagesArr.push(uploaded.secure_url);

        // Xóa file tạm trong server
        fs.unlinkSync(file.path);
      }
    }
    // ========== TẠO CATEGORY ==========
    const category = new CategoryModel({
      name: request.body.name,
      images: imagesArr, // nếu không có hình → []
      parentId: request.body.parentId || null,
      parentCatName: request.body.parentCatName || null,
    });

    const savedCategory = await category.save();

    return response.status(201).json({
      success: true,
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get Categories
export async function getCategories(request, response) {
  try {
    const categories = await CategoryModel.find();
    const categoryMap = {};

    // Lưu theo string key
    categories.forEach((cat) => {
      const id = String(cat._id);
      categoryMap[id] = { ...cat._doc, children: [] };
    });

    const rootCategories = [];

    categories.forEach((cat) => {
      const id = String(cat._id);
      const parentId = cat.parentId ? String(cat.parentId) : null;

      if (parentId && categoryMap[parentId]) {
        categoryMap[parentId].children.push(categoryMap[id]);
      } else {
        rootCategories.push(categoryMap[id]);
      }
    });

    return response.status(200).json({
      success: true,
      data: rootCategories,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get sub category count
export async function getCategoryCount(request, response) {
  try {
    const categoryCount = await CategoryModel.countDocuments({
      parentId: undefined,
    });
    if (!categoryCount) {
      response.status(500).json({ success: false, error: true });
    } else {
      response.send({
        categoryCount: categoryCount,
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get category count
export async function getSubCategoryCount(request, response) {
  try {
    const categories = await CategoryModel.find();
    if (!categories) {
      response.status(500).json({ success: false, error: true });
    } else {
      const subCatList = [];
      for (let cat of categories) {
        if (cat.parentId !== undefined) {
          subCatList.push(cat);
        }
      }

      response.send({
        subCategoryCount: subCatList.length,
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get single category
export async function getCategory(request, response) {
  try {
    const category = await CategoryModel.find({ parentId: request.params.id });

    if (!category) {
      return response.status(404).json({
        message: "The category with the given ID was not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      category: category,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function removeImageFromCloudinary(request, response) {
  const imgUrl = request.query.img;
  const urlArr = imgUrl.split("/");

  const image = urlArr[urlArr.length - 1];
  const imageName = image.split(".")[0];

  if (imageName) {
    const res = await cloudinary.uploader.destroy(
      imageName,
      (error, result) => {
        // console.log(error , res)
      }
    );
    if (res) {
      response.status(200).send(res);
    }
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    // Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid category ID format",
        error: true,
        success: false,
      });
    }

    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found!",
        success: false,
        error: true,
      });
    }

    // -----------------------
    // XÓA ẢNH CATEGORY CHÍNH
    // -----------------------
    for (let imgUrl of category.images) {
      const filename = imgUrl.split("/").pop().split(".")[0];
      if (filename) {
        cloudinary.uploader.destroy(filename);
      }
    }

    // -----------------------
    // LẤY SUB CATEGORY LEVEL 1
    // -----------------------
    const subCategory = await CategoryModel.find({ parentId: id });

    for (const sub of subCategory) {
      // -----------------------
      // LẤY SUB CATEGORY LEVEL 2
      // -----------------------
      const thirdLevel = await CategoryModel.find({ parentId: sub._id });

      // Xóa category level 2
      for (const third of thirdLevel) {
        await CategoryModel.findByIdAndDelete(third._id);
      }

      // Xóa category level 1
      await CategoryModel.findByIdAndDelete(sub._id);
    }

    // -----------------------
    // XÓA CATEGORY CHÍNH
    // -----------------------
    await CategoryModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category Deleted",
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}

export async function updateCategory(request, response) {
  try {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({
        message: "Invalid category ID",
        success: false,
        error: true,
      });
    }

    const category = await CategoryModel.findByIdAndUpdate(
      id,
      {
        name: request.body.name,
        images: imagesArr.length > 0 ? imagesArr[0] : request.body.images,
        parentId: request.body.parentId,
        parentCatName: request.body.parentCatName,
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return response.status(404).json({
        message: "Category cannot be updated!",
        success: false,
        error: true,
      });
    }

    let imagesArr = [];

    response.status(200).json({
      error: false,
      success: true,
      category: category,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      message: "Server error",
      success: false,
      error: true,
    });
  }
}
