import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState } from "react";
import { useContext } from "react";
import { MyContext } from "../../App";
import { deleteImages } from "../../utils/api";
import UploadBox from "../../Components/UploadBox";

const AddBannerV1 = () => {
  const [productCat, setProductCat] = useState("");
  const [productSubCat, setProductSubCat] = useState("");
  const [previews, setPreviews] = useState([]);
  const [productThirLaveldCat, setProductThirLaveldCat] = useState("");
  const [formFields, setFormFields] = useState({
    catId: "",
    bannerTitle: "",
    subCatId: "",
    thirdsubCatId: "",
    price: "",
  });

  const context = useContext(MyContext);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = () => {};

  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-3 p-8 " onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">
          <div className="grid grid-cols-5 mb-3 gap-5">
            <div className="col ">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Banner Title
              </h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none
            focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="bannerTitle"
                value={formFields.bannerTitle}
                onChange={onChangeInput}
              />
            </div>

            <div className="col ">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Banner Category
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

            <div className="col ">
              <h3 className="text-[14px] font-[500] mb-1 text-black">Price</h3>
              <input
                type="number"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none
            focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="price"
                value={formFields.price}
                onChange={onChangeInput}
              />
            </div>
          </div>

          <br />

          <h3 className="text-[18px] font-[500] mb-0 text-black"> Image</h3>

          <br />
          <div className="grid grid-cols-8 gap-4">
            {previews?.length !== 0 &&
              previews?.map((image, index) => {
                return (
                  <>
                    <div className="uploadBoxWrapper relative" key={index}>
                      <span
                        className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] 
                -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                        onClick={() => removeImg(image, index)}
                      >
                        <IoMdClose className="text-white text-[17px]" />
                      </span>
                      <div
                        className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)]
                    h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative"
                      >
                        <img src={image} alt="" className="w-100" />
                      </div>
                    </div>
                  </>
                );
              })}

            <UploadBox
              multiple={true}
              name="images"
              url="/api/category/uploadImages"
              setPreviewsFun={setPreviewsFun}
            />
          </div>
        </div>
      </form>
    </section>
  );
};

export default AddBannerV1;
