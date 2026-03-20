import React, { useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState } from "react";
import { useContext } from "react";
import { MyContext } from "../../App";
import {
  deleteImages,
  editData,
  fetchDataFromApi,
  postData,
} from "../../utils/api";
import UploadBox from "../../Components/UploadBox";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import { IoMdClose } from "react-icons/io";

const EditBannerV1 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productCat, setProductCat] = useState("");
  const [productSubCat, setProductSubCat] = useState("");
  const [previews, setPreviews] = useState([]);
  const [productThirLaveldCat, setProductThirLaveldCat] = useState("");
  const [alignInfo, setAlignInfo] = useState("");
  const [formFields, setFormFields] = useState({
    catId: "",
    bannerTitle: "",
    subCatId: "",
    thirdsubCatId: "",
    price: "",
    images: [],
    alignInfo: "",
  });

  const context = useContext(MyContext);
  const history = useNavigate();

useEffect(() => {
  const id = context?.isOpenFullScreenPanel?.id;

  fetchDataFromApi(`/api/bannerV1/${id}`).then((res) => {
    setFormFields({
      bannerTitle: res?.banner?.bannerTitle || "",
      price: res?.banner?.price || "",
      images: res?.banner?.images || [],
      catId: res?.banner?.catId || "",
      subCatId: res?.banner?.subCatId || "",
      thirdsubCatId: res?.banner?.thirdsubCatId || "",

      alignInfo: res?.banner?.alignInfo || "",
    });
    setPreviews(res?.banner?.images || []);
    setProductCat(res?.banner?.catId || "");
    setProductSubCat(res?.banner?.subCatId || "");
    setProductThirLaveldCat(res?.banner?.thirdsubCatId || "");
    setAlignInfo(res?.banner?.alignInfo || ""); // ✅ lấy từ res, không phải event
  });
}, []);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const setPreviewsFun = (previewArr) => {
    setPreviews((prev) => [...prev, ...previewArr]);
    setFormFields((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...previewArr],
    }));
  };

  const removeImg = (image, index) => {
    deleteImages(`/api/bannerV1/deteleImage?img=${image}`).then(() => {
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

const handleChangeAlignInfo = (event) => {
  const value = event.target.value;
  setAlignInfo(value);
  setFormFields((prev) => ({ ...prev, align: value })); // ✅ không mutate trực tiếp
};

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.bannerTitle === "") {
      context.alertBox("error", "Please enter bannerTitle");
      setIsLoading(false);
      return false;
    }

    if (formFields.price === "") {
      context.alertBox("error", "Please enter price");
      setIsLoading(false);
      return false;
    }

    if (previews?.length === 0) {
      context.alertBox("error", "Please Category image");
      setIsLoading(false);
      return false;
    }

    editData(
      `/api/bannerV1/${context?.isOpenFullScreenPanel?.id}`,
      formFields,
    ).then((res) => {
      console.log(res);
      setTimeout(() => {
        {
          setIsLoading(false);
          context.setIsOpenFullScreenPanel({
            open: false,
          });
          history("/bannerV1/list");
        }
      }, 2500);
    });
  };

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

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Align Info
              </h3>
              {context?.catData?.length !== 0 && (
                <Select
                  size="small"
                  className="w-full"
                  value={alignInfo}
                  onChange={handleChangeAlignInfo}
                >
                  <MenuItem value={"left"}>Left</MenuItem>
                  <MenuItem value={"right"}>Right</MenuItem>
                </Select>
              )}
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
              url="/api/bannerV1/uploadImages"
              setPreviewsFun={setPreviewsFun}
            />
          </div>
        </div>

        <br />
        <br />
        <div className="w-[250px]">
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
        </div>
      </form>
    </section>
  );
};

export default EditBannerV1;
