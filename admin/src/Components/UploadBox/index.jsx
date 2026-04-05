import React, { useContext, useState } from "react";
import { FaRegImages } from "react-icons/fa6";
import { uploadImages } from "../../utils/api";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";

const UploadBox = (props) => {
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const context = useContext(MyContext);

  const onChangeFile = async (e, apiEndpoint) => {
    try {
      setPreviews([]);
      const files = e.target.files;
      setUploading(true);

      const formData = new FormData(); // ✅ tạo mới mỗi lần
      const selectdImages = []; // ✅ tạo mới mỗi lần

      for (var i = 0; i < files.length; i++) {
        if (
          files[i] &&
          (files[i].type === "image/jpeg" ||
            files[i].type === "image/jpg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp")
        ) {
          const file = files[i];
          selectdImages.push(file);
          formData.append(props?.name, file); // ✅ field name phải khớp upload.single('images')
        } else {
          context.alertBox(
            "error",
            "Please select a valid JPG, PNG or webp image file",
          );
          setUploading(false);
          return false;
        }
      }

      uploadImages(apiEndpoint, formData).then((res) => {
        setUploading(false);
        if (props?.setBannerImagesFun) {
          props.setBannerImagesFun(res.data.images);
        } else if (props?.setPreviewsFun) {
          props.setPreviewsFun(res.data.images);
        }
      });
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <>
      <div
        className="uploadBox p-3 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)]
        h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative"
      >
        {uploading === true ? (
          <>
            <CircularProgress />
            <h4 className="text-center">Uploading...</h4>
          </>
        ) : (
          <>
            <FaRegImages className="text-[40px] opacity-35" />
            <h4 className="text-[14px]">Image Upload</h4>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => onChangeFile(e, props?.url)}
              name={props?.name}
              multiple={props?.multiple !== undefined ? props?.multiple : false}
              className="absolute top-0 left-0 w-full h-full z-50 opacity-0"
            />
          </>
        )}
      </div>
    </>
  );
};

export default UploadBox;
