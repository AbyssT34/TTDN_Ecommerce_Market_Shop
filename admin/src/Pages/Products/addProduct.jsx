import React, { useContext, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Rating from "@mui/material/Rating";
import UploadBox from "../../Components/UploadBox";
import { IoMdClose } from "react-icons/io";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import { deleteImages, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [productCat, setProductCat] = useState("");
  const [productSubCat, setProductSubCat] = useState("");
  const [productFeatured, setproductFeatured] = useState("");
  const [productRams, setproductRams] = useState([]);
  const [productWeight, setproductWeight] = useState([]);
  const [productSize, setproductSize] = useState([]);
  const [productThirLaveldCat, setProductThirLaveldCat] = useState("");
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    description: "",
    images: [],
    brand: "",
    price: "",
    oldPrice: "",
    catName: "",
    catId: "",
    subCatId: "",
    subCat: "",
    thirdsubCat: "",
    thirdsubCatId: "",
    category: "",
    countInStock: "",
    rating: "",
    isFeatured: false,
    discount: "",
    productRam: [],
    size: [],
    productWeight: [],
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  const setPreviewsFun = (previewArr) => {
    setPreviews((prev) => [...prev, ...previewArr]);
    setFormFields((prev) => ({
      ...prev,
      images: [...prev.images, ...previewArr],
    }));
  };

  const removeImg = (image, index) => {
    deleteImages(`/api/category/deteleImage?img=${image}`).then(() => {
      const imageArr = previews.filter((_, i) => i !== index);
      setPreviews(imageArr);
      setFormFields((prev) => ({ ...prev, images: imageArr }));
    });
  };

  // ✅ Category
  const handleChangeProductCat = (event) => {
    const value = event.target.value;
    setProductCat(value);
    const selectedCat = context?.catData?.find((cat) => cat._id === value);
    setFormFields((prev) => ({
      ...prev,
      catId: value,
      category: value,
      catName: selectedCat?.name || "",
    }));
  };

  // ✅ Sub Category
  const handleChangeProductSudCat = (event) => {
    const value = event.target.value;
    setProductSubCat(value);
    let subCatName = "";
    context?.catData?.forEach((cat) => {
      cat?.children?.forEach((sub) => {
        if (sub._id === value) subCatName = sub.name;
      });
    });
    setFormFields((prev) => ({
      ...prev,
      subCatId: value,
      subCat: subCatName,
    }));
  };

  // ✅ Third Level Category
  const handleChangeProductThirLavelCat = (event) => {
    const value = event.target.value;
    setProductThirLaveldCat(value);
    let thirdCatName = "";
    context?.catData?.forEach((cat) => {
      cat?.children?.forEach((sub) => {
        sub?.children?.forEach((third) => {
          if (third._id === value) thirdCatName = third.name;
        });
      });
    });
    setFormFields((prev) => ({
      ...prev,
      thirdsubCatId: value,
      thirdsubCat: thirdCatName,
    }));
  };

  // ✅ Featured
  const handleChangeProductFeatured = (event) => {
    const value = event.target.value;
    setproductFeatured(value);
    setFormFields((prev) => ({ ...prev, isFeatured: value }));
  };

  // ✅ Rams
  const handleChangeProductRams = (event) => {
    const {
      target: { value },
    } = event;
    const arr = typeof value === "string" ? value.split(",") : value;
    setproductRams(arr);
    setFormFields((prev) => ({ ...prev, productRam: arr }));
  };

  // ✅ Weight
  const handleChangeProductWeight = (event) => {
    const {
      target: { value },
    } = event;
    const arr = typeof value === "string" ? value.split(",") : value;
    setproductWeight(arr);
    setFormFields((prev) => ({ ...prev, productWeight: arr }));
  };

  // ✅ Size
  const handleChangeProductSize = (event) => {
    const {
      target: { value },
    } = event;
    const arr = typeof value === "string" ? value.split(",") : value;
    setproductSize(arr);
    setFormFields((prev) => ({ ...prev, size: arr }));
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeRating = (e) => {
    setFormFields((prev) => ({ ...prev, rating: e.target.value }));
  };

  const handleSubmitg = (e) => {
    e.preventDefault();

    if (formFields.name === "")
      return context.alertBox("error", "Please enter product name");
    if (formFields.description === "")
      return context.alertBox("error", "Please enter product description");
    if (formFields.catId === "")
      return context.alertBox("error", "Please select product category");
    if (formFields.price === "")
      return context.alertBox("error", "Please enter product price");
    if (formFields.oldPrice === "")
      return context.alertBox("error", "Please enter product old price");
    if (formFields.countInStock === "")
      return context.alertBox("error", "Please enter product stock");
    if (formFields.brand === "")
      return context.alertBox("error", "Please enter product brand");
    if (formFields.discount === "")
      return context.alertBox("error", "Please enter product discount");
    if (previews?.length === 0)
      return context.alertBox("error", "Please select product image");

    setIsLoading(true);

    postData(`/api/product/create`, formFields)
      .then((res) => {
        setIsLoading(false);
        if (res?.error === false) {
          context.alertBox(
            "success",
            res?.message || "Product created successfully",
          );
          context.setIsOpenFullScreenPanel({ open: false });
          history("/products");
        } else {
          context.alertBox("error", res?.message || "Failed to create product");
        }
      })
      .catch(() => {
        setIsLoading(false);
        context.alertBox("error", "Failed to create product");
      });
  };

  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-3 p-8" onSubmit={handleSubmitg}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4">
          {/* Name */}
          <div className="grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Name
              </h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="name"
                value={formFields.name}
                onChange={onChangeInput}
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Description
              </h3>
              <textarea
                className="w-full h-[140px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="description"
                value={formFields.description}
                onChange={onChangeInput}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 mb-3 gap-4">
            {/* Category */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Category
              </h3>
              {context?.catData?.length !== 0 && (
                <Select
                  size="small"
                  className="w-full"
                  value={productCat}
                  onChange={handleChangeProductCat}
                >
                  {context?.catData.map((cat, index) => (
                    <MenuItem value={cat?._id} key={index}>
                      {cat?.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </div>

            {/* Sub Category */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Sub Category
              </h3>
              {context?.catData?.length !== 0 && (
                <Select
                  size="small"
                  className="w-full"
                  value={productSubCat}
                  onChange={handleChangeProductSudCat}
                >
                  {context?.catData.map((cat) =>
                    cat?.children?.map((subCat, index) => (
                      <MenuItem value={subCat?._id} key={index}>
                        {subCat?.name}
                      </MenuItem>
                    )),
                  )}
                </Select>
              )}
            </div>

            {/* Third Level */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Third Level
              </h3>
              {context?.catData?.length !== 0 && (
                <Select
                  size="small"
                  className="w-full"
                  value={productThirLaveldCat}
                  onChange={handleChangeProductThirLavelCat}
                >
                  {context?.catData.map((cat) =>
                    cat?.children?.map((subCat) =>
                      subCat?.children?.map((thirdLavelCat, index) => (
                        <MenuItem value={thirdLavelCat?._id} key={index}>
                          {thirdLavelCat?.name}
                        </MenuItem>
                      )),
                    ),
                  )}
                </Select>
              )}
            </div>

            {/* Price */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Price
              </h3>
              <input
                type="number"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="price"
                value={formFields.price}
                onChange={onChangeInput}
              />
            </div>

            {/* Old Price */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Old Price
              </h3>
              <input
                type="number"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="oldPrice"
                value={formFields.oldPrice}
                onChange={onChangeInput}
              />
            </div>

            {/* Featured */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Is Featured?
              </h3>
              <Select
                size="small"
                className="w-full"
                value={productFeatured}
                onChange={handleChangeProductFeatured}
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </div>

            {/* Stock */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Stock
              </h3>
              <input
                type="number"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="countInStock"
                value={formFields.countInStock}
                onChange={onChangeInput}
              />
            </div>

            {/* Brand */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Brand
              </h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="brand"
                value={formFields.brand}
                onChange={onChangeInput}
              />
            </div>

            {/* Discount */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Discount
              </h3>
              <input
                type="number"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="discount"
                value={formFields.discount}
                onChange={onChangeInput}
              />
            </div>

            {/* Rams */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Rams
              </h3>
              <Select
                multiple
                size="small"
                className="w-full"
                value={productRams}
                onChange={handleChangeProductRams}
              >
                <MenuItem value={"4GB"}>4GB</MenuItem>
                <MenuItem value={"6GB"}>6GB</MenuItem>
                <MenuItem value={"8GB"}>8GB</MenuItem>
              </Select>
            </div>

            {/* Weight */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Weight
              </h3>
              <Select
                multiple
                size="small"
                className="w-full"
                value={productWeight}
                onChange={handleChangeProductWeight}
              >
                <MenuItem value={"10"}>2KG</MenuItem>
                <MenuItem value={"20"}>4KG</MenuItem>
                <MenuItem value={"30"}>5KG</MenuItem>
              </Select>
            </div>

            {/* Size */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Size
              </h3>
              <Select
                multiple
                size="small"
                className="w-full"
                value={productSize}
                onChange={handleChangeProductSize}
              >
                <MenuItem value={"S"}>S</MenuItem>
                <MenuItem value={"M"}>M</MenuItem>
                <MenuItem value={"L"}>L</MenuItem>
              </Select>
            </div>
          </div>

          {/* Rating */}
          <div className="grid grid-cols-4 mb-3 gap-4">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Rating
              </h3>
              <Rating
                name="half-rating"
                defaultValue={1}
                precision={0.5}
                onChange={onChangeRating}
              />
            </div>
          </div>

          {/* Images */}
          <div className="col w-full p-5 px-0">
            <h3 className="font-[700] text-[18px] mb-3">Media & Images</h3>
            <div className="grid grid-cols-8 gap-4">
              {previews?.map((image, index) => (
                <div className="uploadBoxWrapper relative" key={index}>
                  <span
                    className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                    onClick={() => removeImg(image, index)}
                  >
                    <IoMdClose className="text-white text-[17px]" />
                  </span>
                  <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
              <UploadBox
                multiple={true}
                name="images"
                url="/api/product/uploadImages"
                setPreviewsFun={setPreviewsFun}
              />
            </div>
          </div>
        </div>

        <br />
        <hr />
        <br />

        <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">
          {isLoading === true ? (
            <CircularProgress color="inherit" />
          ) : (
            <>
              <FaCloudUploadAlt className="text-[25px] text-white" />
              Publish and View
            </>
          )}
        </Button>
      </form>
    </section>
  );
};

export default AddProduct;
