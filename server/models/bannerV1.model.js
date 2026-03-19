import mongoose from "mongoose";

const bannerV1Schema = new mongoose.Schema(
  {
    bannerTitle: {
      type: String,
      default: "",
      required: true,
    },
    catId: {
      type: String,
      default: "",
      required: true,
    },
    subCatId: {
      type: String,
      default: "",
      required: true,
    },
    thirdsubCatId: {
      type: String,
      default: "",
      required: true,
    },
    price: {
      type: Number,
      default: "",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const bannerV1Model = mongoose.model("bannerV1", bannerV1Schema);

export default bannerV1Model;
