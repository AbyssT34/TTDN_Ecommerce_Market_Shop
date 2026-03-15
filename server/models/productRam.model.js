import mongoose from "mongoose";

const productRamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ProductRamsModel = mongoose.model("ProductRam", productRamSchema);

export default ProductRamsModel; 



