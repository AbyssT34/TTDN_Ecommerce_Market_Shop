import ProductModel from "../models/product.model.js";
import ProductRamsModel from "../models/productRam.model.js";
import ProductWeightModel from "../models/productWeight.model.js";
import ProductSizeModel from "../models/productSize.model.js";

import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
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
    const images = request.files;

    for (const file of images) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });

      // LƯU ảnh vào biến toàn cục
      imagesArr.push(uploaded.secure_url);

      fs.unlinkSync(file.path);
    }

    return response.status(200).json({
      images: imagesArr,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function uploadBannerImages(request, response) {
  try {
    const bannerImage = request.files; // ✅ đây là array files

    const imagesArr = []; // ✅ khai báo local, bỏ biến global

    for (const file of bannerImage) {
      // ✅ dùng bannerImage, không phải images
      const uploaded = await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });

      imagesArr.push(uploaded.secure_url);
      fs.unlinkSync(file.path);
    }

    return response.status(200).json({
      images: imagesArr, // ✅ trả về imagesArr
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//create product
export async function createProduct(request, response) {
  try {
    let product = new ProductModel({
      name: request.body.name,
      description: request.body.description,
      images: request.body.images, // ✅ từ body
      bannerimages: request.body.bannerimages, // ✅ từ body
      bannerTitleName: request.body.bannerTitleName,
      brand: request.body.brand,
      price: request.body.price,
      oldPrice: request.body.oldPrice,
      catName: request.body.catName,
      category: request.body.category,
      catId: request.body.catId,
      subCatId: request.body.subCatId,
      subCat: request.body.subCat,
      thirdsubCat: request.body.thirdsubCat,
      thirdsubCatId: request.body.thirdsubCatId,
      countInStock: request.body.countInStock,
      rating: request.body.rating,
      isFeatured: request.body.isFeatured,
      discount: request.body.discount,
      productRam: request.body.productRam,
      size: request.body.size,
      productWeight: request.body.productWeight,
    });

    product = await product.save();

    if (!product) {
      return response.status(500).json({
        success: false,
        error: true,
        message: "Product Not Created",
      });
    }

    return response.status(201).json({
      message: "Product Created Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products
export async function getAllProducts(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products By CatId
export async function getAllProductsByCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 1000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ catId: request.params.id })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products By name
export async function getAllProductsByCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 1000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ catName: request.query.catName })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products Sub CatId
export async function getAllProductsBySubCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 1000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ subCatId: request.params.id })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products By Sub Cat Name
export async function getAllProductsBySubCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 1000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ subCat: request.query.subCat })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products Third Laver Sub CatId
export async function getAllProductsBySubThirdLaveCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 1000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      thirdsubCatId: request.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products By Third Laver Sub Cat Name
export async function getAllProductsBySubThirdLaveCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 1000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      thirdsubCat: request.query.thirdsubCat,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products By price
export async function getAllProductsByPrice(request, response) {
  try {
    let productList = [];

    if (request.query.catId !== "" && request.query.catId !== undefined) {
      const productListArr = await ProductModel.find({
        catId: request.query.catId,
      })
        .populate("category")
        .exec();

      productList = productListArr;
    }

    if (request.query.subCatId !== "" && request.query.subCatId !== undefined) {
      const productListArr = await ProductModel.find({
        subCatId: request.query.subCatId,
      })
        .populate("category")
        .exec();

      productList = productListArr;
    }

    if (
      request.query.thirdsubCatId !== "" &&
      request.query.thirdsubCatId !== undefined
    ) {
      const productListArr = await ProductModel.find({
        thirdsubCatId: request.query.thirdsubCatId,
      })
        .populate("category")
        .exec();

      productList = productListArr;
    }

    const filteredProducts = productList.filter((product) => {
      if (
        request.query.minPrice &&
        product.price < parseFloat(request.query.minPrice)
      ) {
        return false;
      }
      if (
        request.query.maxPrice &&
        product.price > parseFloat(request.query.maxPrice)
      ) {
        return false;
      }
      return true;
    });

    return response.status(200).json({
      products: filteredProducts,
      totalPages: 0,
      page: 0,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products By rating
export async function getAllProductsByRating(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 1000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    let products = [];

    if (request.query.subCatId === "" || request.query.subCatId === undefined) {
      products = await ProductModel.find({
        rating: request.query.rating,
        catId: request.query.catId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (request.query.catId === "" || request.query.catId === undefined) {
      products = await ProductModel.find({
        rating: request.query.rating,
        subCatId: request.query.subCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (
      request.query.thirdsubCatId === "" ||
      request.query.thirdsubCatId === undefined
    ) {
      products = await ProductModel.find({
        rating: request.query.rating,
        thirdsubCatId: request.query.thirdsubCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all products count
export async function getProductsCount(request, response) {
  try {
    const productsCount = await ProductModel.countDocuments();

    if (!productsCount) {
      response.status(500).json({ success: false, error: true });
    }

    return response.status(200).json({
      productCount: productsCount,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all features products
export async function getAllProductsFeatured(request, response) {
  try {
    const products = await ProductModel.find({
      isFeatured: true,
    }).populate("category");

    if (!products) {
      return response.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      products: products,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//delete products
export async function deleteProduct(request, response) {
  try {
    const product = await ProductModel.findById(request.params.id).populate(
      "category",
    );

    if (!product) {
      return response.status(404).json({
        message: "Product Not found",
        error: true,
        success: false,
      });
    }

    const images = product.images;

    let img = "";

    for (img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length - 1];

      const imageName = image.split(".")[0];

      if (imageName) {
        cloudinary.uploader.destroy(imageName, (error, result) => {
          // console.log(error , result)
        });
      }
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(
      request.params.id,
    );

    if (!deletedProduct) {
      response.status(404).json({
        message: "Products not found!",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: "Product Deleted",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//delete multiple products
export async function deleteMultipleProduct(request, response) {
  const { ids } = request.body;
  console.log("request.body:", request.body); // ← thêm dòng này

  // ✅ Early return — nằm độc lập, không bọc logic bên trong
  if (!ids || !Array.isArray(ids)) {
    return response.status(400).json({
      error: true,
      success: false,
      message: "Invalid input",
    });
  }

  try {
    // ✅ Xóa ảnh trên Cloudinary trước
    for (let i = 0; i < ids.length; i++) {
      const product = await ProductModel.findById(ids[i]);
      if (!product) continue; // ✅ bỏ qua nếu không tìm thấy

      const images = product.images;

      for (const imgUrl of images) {
        const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split(".")[0]; // ✅ khai báo đúng scope

        if (imageName) {
          cloudinary.uploader.destroy(imageName, (error, result) => {});
        }
      }
    }

    // ✅ ids thay vì is (typo cũ)
    await ProductModel.deleteMany({ _id: { $in: ids } });

    return response.status(200).json({
      success: true,
      error: false,
      message: "Products Deleted",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
//get single products
export async function getProduct(request, response) {
  try {
    const product = await ProductModel.findById(request.params.id).populate(
      "category",
    );

    if (!product) {
      return response.status(404).json({
        message: "The products is not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      product: product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//detele imgaes
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
      },
    );
    if (res) {
      response.status(200).send(res);
    }
  }
}

//update product
export async function updateProducts(request, response) {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
        description: request.body.description,
        images: request.body.images, // ✅ từ body
        bannerimages: request.body.bannerimages, // ✅ đúng field name
        bannerTitleName: request.body.bannerTitleName,
        isDisplayOnHomeBanner: request.body.isDisplayOnHomeBanner,
        brand: request.body.brand,
        price: request.body.price,
        oldPrice: request.body.oldPrice,
        catName: request.body.catName,
        catId: request.body.catId,
        subCatId: request.body.subCatId,
        subCat: request.body.subCat,
        thirdsubCat: request.body.thirdsubCat,
        thirdsubCatId: request.body.thirdsubCatId,
        countInStock: request.body.countInStock,
        rating: request.body.rating,
        isFeatured: request.body.isFeatured,
        discount: request.body.discount,
        productRam: request.body.productRam,
        size: request.body.size,
        productWeight: request.body.productWeight,
      },
      { new: true },
    );

    if (!product) {
      return response.status(404).json({
        message: "The product can not be updated!",
        status: false,
      });
    }

    imagesArr = [];

    return response.status(200).json({
      message: "The product is updated",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//create product ram
export async function createProductRam(request, response) {
  try {
    let productRam = new ProductRamsModel({
      name: request.body.name,
    });

    productRam = await productRam.save();

    if (!productRam) {
      return response.status(500).json({
        success: false,
        message: "ProductRam Not Created",
      });
    }

    return response.status(201).json({
      message: "ProductRam Created Successfully",
      success: true,
      error: false,
      data: productRam,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all product rams
export async function getProductRams(request, response) {
  try {
    const productRams = await ProductRamsModel.find();

    if (!productRams) {
      return response.status(500).json({
        message: "No ProductRams found",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      data: productRams,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get product ram by id
export async function getProductRamsById(request, response) {
  try {
    const productRam = await ProductRamsModel.findById(request.params.id);

    if (!productRam) {
      return response.status(404).json({
        message: "ProductRam not found",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      data: productRam,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//delete product ram
export async function deleteProductRams(request, response) {
  try {
    const productRam = await ProductRamsModel.findById(request.params.id);

    if (!productRam) {
      return response.status(404).json({
        message: "ProductRam Not found",
        error: true,
        success: false,
      });
    }

    const deletedProductRam = await ProductRamsModel.findByIdAndDelete(
      request.params.id,
    );

    if (!deletedProductRam) {
      return response.status(404).json({
        message: "ProductRam not found!",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: "ProductRam Deleted",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//update product ram
export async function updateProductRams(request, response) {
  try {
    const productRam = await ProductRamsModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
      },
      { new: true },
    );

    if (!productRam) {
      return response.status(404).json({
        message: "ProductRam can not be updated!",
        status: false,
      });
    }

    return response.status(200).json({
      message: "ProductRam is updated",
      error: false,
      success: true,
      data: productRam, // ✅ dùng data để đồng nhất
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//delete multiple product rams
export async function deleteMultipleProductRams(request, response) {
  const { ids } = request.body;

  if (!ids || !Array.isArray(ids)) {
    return response.status(400).json({
      error: true,
      success: false,
      message: "Invalid input",
    });
  }

  try {
    await ProductRamsModel.deleteMany({ _id: { $in: ids } });

    return response.status(200).json({
      success: true,
      error: false,
      message: "ProductRams Deleted",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//create product weight
export async function createProductWeight(request, response) {
  try {
    let productWeight = new ProductWeightModel({
      name: request.body.name,
    });

    productWeight = await productWeight.save();

    if (!productWeight) {
      return response.status(500).json({
        success: false,
        message: "ProductWeight Not Created",
      });
    }

    return response.status(201).json({
      message: "ProductWeight Created Successfully",
      success: true,
      error: false,
      data: productWeight,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all product weights
export async function getProductWeights(request, response) {
  try {
    const productWeights = await ProductWeightModel.find();

    if (!productWeights) {
      return response.status(500).json({
        message: "No ProductWeights found",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      data: productWeights,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get product weight by id
export async function getProductWeightById(request, response) {
  try {
    const productWeight = await ProductWeightModel.findById(request.params.id);

    if (!productWeight) {
      return response.status(404).json({
        message: "ProductWeight not found",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      data: productWeight,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//update product weight
export async function updateProductWeight(request, response) {
  try {
    const productWeight = await ProductWeightModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
      },
      { new: true },
    );

    if (!productWeight) {
      return response.status(404).json({
        message: "ProductWeight can not be updated!",
        status: false,
      });
    }

    return response.status(200).json({
      message: "ProductWeight is updated",
      error: false,
      success: true,
      data: productWeight,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//delete product weight
export async function deleteProductWeight(request, response) {
  try {
    const productWeight = await ProductWeightModel.findById(request.params.id);

    if (!productWeight) {
      return response.status(404).json({
        message: "ProductWeight Not found",
        error: true,
        success: false,
      });
    }

    const deletedProductWeight = await ProductWeightModel.findByIdAndDelete(
      request.params.id,
    );

    if (!deletedProductWeight) {
      return response.status(404).json({
        message: "ProductWeight not found!",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: "ProductWeight Deleted",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//delete multiple product weights
export async function deleteMultipleProductWeights(request, response) {
  const { ids } = request.body;

  if (!ids || !Array.isArray(ids)) {
    return response.status(400).json({
      error: true,
      success: false,
      message: "Invalid input",
    });
  }

  try {
    await ProductWeightModel.deleteMany({ _id: { $in: ids } });

    return response.status(200).json({
      success: true,
      error: false,
      message: "ProductWeights Deleted",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//create product size
export async function createProductSize(request, response) {
  try {
    let productSize = new ProductSizeModel({
      name: request.body.name,
    });

    productSize = await productSize.save();

    if (!productSize) {
      return response.status(500).json({
        success: false,
        message: "ProductSize Not Created",
      });
    }

    return response.status(201).json({
      message: "ProductSize Created Successfully",
      success: true,
      error: false,
      data: productSize,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all product sizes
export async function getProductSizes(request, response) {
  try {
    const productSizes = await ProductSizeModel.find();

    if (!productSizes) {
      return response.status(500).json({
        message: "No ProductSizes found",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      data: productSizes,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get product size by id
export async function getProductSizeById(request, response) {
  try {
    const productSize = await ProductSizeModel.findById(request.params.id);

    if (!productSize) {
      return response.status(404).json({
        message: "ProductSize not found",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      data: productSize,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//update product size
export async function updateProductSize(request, response) {
  try {
    const productSize = await ProductSizeModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
      },
      { new: true },
    );

    if (!productSize) {
      return response.status(404).json({
        message: "ProductSize can not be updated!",
        status: false,
      });
    }

    return response.status(200).json({
      message: "ProductSize is updated",
      error: false,
      success: true,
      data: productSize,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//delete product size
export async function deleteProductSize(request, response) {
  try {
    const productSize = await ProductSizeModel.findById(request.params.id);

    if (!productSize) {
      return response.status(404).json({
        message: "ProductSize Not found",
        error: true,
        success: false,
      });
    }

    const deletedProductSize = await ProductSizeModel.findByIdAndDelete(
      request.params.id,
    );

    if (!deletedProductSize) {
      return response.status(404).json({
        message: "ProductSize not found!",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: "ProductSize Deleted",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//delete multiple product sizes
export async function deleteMultipleProductSizes(request, response) {
  const { ids } = request.body;

  if (!ids || !Array.isArray(ids)) {
    return response.status(400).json({
      error: true,
      success: false,
      message: "Invalid input",
    });
  }

  try {
    await ProductSizeModel.deleteMany({ _id: { $in: ids } });

    return response.status(200).json({
      success: true,
      error: false,
      message: "ProductSizes Deleted",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//fitters
export async function filtes(request, response) {
  const {
    catId,
    subCatId,
    thirdsubCatId,
    minPrice,
    maxPrice,
    rating,
    page,
    limit,
  } = request.body;

  const filters = {};

  if (catId?.length) {
    filters.catId = { $in: catId };
  }

  if (subCatId?.length) {
    filters.subCatId = { $in: subCatId };
  }

  if (thirdsubCatId?.length) {
    filters.thirdsubCatId = { $in: thirdsubCatId };
  }

  // ✅ Chỉ query price khi minPrice hoặc maxPrice có giá trị thực
  if (minPrice !== "" || maxPrice !== "") {
    filters.price = {
      ...(minPrice !== "" && { $gte: +minPrice }),
      ...(maxPrice !== "" && { $lte: +maxPrice }),
    };
  }

  if (Array.isArray(rating) && rating.length > 0) {
    const minRating = Math.min(...rating.map((r) => Number(r))) - 0.9;
    filters.rating = { $gte: minRating };
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 5;

  try {
    console.log("Final filters:", JSON.stringify(filters));

    const products = await ProductModel.find(filters)
      .populate("category")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await ProductModel.countDocuments(filters);

    return response.status(200).json({
      success: true,
      error: false,
      products: products,
      total: total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.log("ERROR DETAILS:", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// ✅ Sửa - đưa tất cả logic vào trong .sort()
const sortItems = (products, sortBy, order) => {
  return products.sort((a, b) => {
    if (sortBy === "name") {
      return order === "asc"
        ? a.name.localeCompare(b.name)  // ✅ localeCompare
        : b.name.localeCompare(a.name);
    }

    if (sortBy === "price") {  // ✅ nằm trong sort callback
      return order === "asc" ? a.price - b.price : b.price - a.price;
    }

    return 0;
  });
};

// sortBy
export async function sortBy(request, response) {
  try {
    const { sortBy, order } = request.body;

    const sortOptions = {};

    switch (sortBy) {
      case 'sales':
        sortOptions.sale = order === 'asc' ? 1 : -1;
        break;
      case 'name_asc':
        sortOptions.name = 1;
        break;
      case 'name_desc':
        sortOptions.name = -1;
        break;
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price_desc':
        sortOptions.price = -1;
        break;
      default:
        sortOptions.createdAt = -1; // mặc định mới nhất
    }

    const products = await ProductModel.find()
      .sort(sortOptions)
      .populate("category");

    const total = products.length;

    return response.status(200).json({
      success: true,
      error: false,
      products: products,
      total: total,
      totalPages: Math.ceil(total / 10),
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
