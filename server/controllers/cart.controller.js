import CartProductModel from "../models/cart.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItemController = async (request, response) => {
  try {
    const userId = request.userId;
    const {
      productId,
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      quantity,
      subTotal,
      countInStock,
      discount,
      size,
      weight,
      ram,
      brand,
    } = request.body;

    if (!productId) {
      return response.status(400).json({
        message: "Provide productId",
        error: true,
        success: false,
      });
    }

    const checkItemCart = await CartProductModel.findOne({ userId, productId });
    if (checkItemCart) {
      return response.status(400).json({
        message: "This specific variation is already in your cart",
        error: true,
        success: false,
      });
    }

    const cartItem = new CartProductModel({
      productId,
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      quantity,
      subTotal,
      countInStock,
      discount,
      size,
      weight,
      ram,
      userId,
      brand,
    });

    const save = await cartItem.save();

    return response.status(200).json({
      data: save,
      message: "Item added successfully",
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
};

export const getCartItemController = async (request, response) => {
  try {
    const userId = request.userId;
    const cartItems = await CartProductModel.find({
      userId: userId,
    });

    return response.json({
      data: cartItems,
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
};

export const updateCartItemQtyController = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id, qty, subTotal, size , weight, ram } = request.body;

    if (!_id || !qty) {
      return response.status(400).json({
        message: "provide _id , qty",
      });
    }

    const updateCartitem = await CartProductModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: qty,
        subTotal: subTotal,
        size: size,
        weight: weight,
        ram:ram,
      },
      { new: true },
    );

    return response.json({
      message: "Update cart",
      success: true,
      error: false,
      data: updateCartitem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const deleteCartItemQtyController = async (request, response) => {
  try {
    const userId = request.userId;
    const { id } = request.params; // Đã sửa: lấy id từ params

    if (!id) {
      return response.status(400).json({
        message: "Provide _id",
        error: true,
        success: false,
      });
    }

    const deleteCartItem = await CartProductModel.deleteOne({
      _id: id,
      userId: userId, // Đảm bảo người dùng chỉ xóa được hàng của chính mình
    });

    // deleteOne trả về object có deletedCount
    if (deleteCartItem.deletedCount === 0) {
      return response.status(404).json({
        message: "The product in the cart is not found or already deleted",
        error: true,
        success: false,
      });
    }

    // Bỏ user.save() nếu không cần thiết để tránh lỗi 'user is not defined'

    return response.status(200).json({
      message: "Item removed successfully",
      success: true,
      error: false,
      data: deleteCartItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const emptyCartController = async (request, response) => {
  try {

    const userId = request.params.id

    await CartProductModel.deleteMany({userId : userId})

     return response.status(200).json({
       message: "All items in the cart deleted successfully",
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

