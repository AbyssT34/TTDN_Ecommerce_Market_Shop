import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async (request, response) => {
  try {
    const {
      address_line1,
      city,
      state,
      pincode,
      country,
      mobile,
      status,
      userId,
      selected,
    } = request.body;

    // if (
    //   address_line1 ||
    //   city ||
    //   state ||
    //   pincode ||
    //   country ||
    //   mobile ||
    //   status || userId
    // ) {
    //   return response.status(500).json({
    //     message: "Please provide all the fields" || error,
    //     error: true,
    //     success: false,
    //   });
    // }

    const address = new AddressModel({
      address_line1,
      city,
      state,
      pincode,
      country,
      mobile,
      status,
      userId,
      selected,
    });

    const saveAddress = await address.save();

    const updateCartUser = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { $push: { address_details: saveAddress?._id } },
      { new: true },
    );

    return response.status(200).json({
      data: saveAddress,
      message: "Item add successfully",
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

export const getAllAddressController = async (request, response) => {
  try {
    const address = await AddressModel.find({
      userId: request?.query?.userId,
    });

    if (!address || address.length === 0) {
      return response.status(404).json({
        // ✅ thêm status code và .json()
        error: true,
        success: false,
        message: "Address not found",
      });
    } else {
      const updateUser = await UserModel.updateOne(
        { _id: request?.query?.userId },
        {
          $push: {
            address: address?._id,
          },
        },
      );
    }

    return response.status(200).json({
      // ✅ thêm status code và .json()
      error: false,
      success: true,
      data: address, // ✅ đổi address → data cho nhất quán
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

