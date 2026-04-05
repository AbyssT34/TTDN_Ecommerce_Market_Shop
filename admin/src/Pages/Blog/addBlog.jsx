import React, { useContext, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import UploadBox from "../../Components/UploadBox";
import { IoMdClose } from "react-icons/io";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { deleteImages, postData } from "../../utils/api";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import Editor from "react-simple-wysiwyg";

const AddBlog = () => {
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [html, setHtml] = useState("");
  const [formFields, setFormFields] = useState({
    title: "",
    images: [],
    description: "",
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const setPreviewsFun = (previewArr) => {
    setPreviews((prev) => [...prev, ...previewArr]);
    setFormFields((prev) => ({
      ...prev,
      images: [...prev.images, ...previewArr], // ✅ dùng setState
    }));
  };

  const removeImg = (image, index) => {
    var imageArr = [];
    imageArr = previews;
    deleteImages(`/api/blog/deteleImage?img=${image}`).then((res) => {
      imageArr.splice(index, 1);
      setPreviews([]);
      setTimeout(() => {
        setPreviews(imageArr);
        setFormFields((prev) => ({
          ...prev,
          images: [...prev.images, ...imageArr],
        }));
      }, 100);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.title === "") {
      context.alertBox("error", "Please enter title");
      setIsLoading(false);
      return false;
    }

    if (formFields.description === "") {
      context.alertBox("error", "Please enter description");
      setIsLoading(false);
      return false;
    }

    if (previews?.length === 0) {
      context.alertBox("error", "Please Category image");
      setIsLoading(false);
      return false;
    }

    postData(`/api/blog/add`, formFields).then((res) => {
      console.log(res);
      setTimeout(() => {
        {
          setIsLoading(false);
          context.setIsOpenFullScreenPanel({
            open: false,
          });
          history("/blog/list");
        }
      }, 2500);
    });
  };

  const onChangeDescription = (e) => {
    setHtml(e.target.value);
    formFields.description = e.target.value;
  };

  return (
    <>
      <section className="p-5 bg-gray-50">
        <form className="form py-3 p-8 " onSubmit={handleSubmit}>
          <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">
            <div className="grid grid-cols-1 mb-3">
              <div className="col w-[100%]">
                <h3 className="text-[14px] font-[500] mb-1 text-black">
                  Title
                </h3>
                <input
                  type="text"
                  className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none
            focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                  name="title"
                  value={formFields.title}
                  onChange={onChangeInput}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 mb-3">
              <div className="col w-[100%]">
                <h3 className="text-[14px] font-[500] mb-1 text-black">
                  Description
                </h3>
                <Editor
                  value={html}
                  onChange={onChangeDescription}
                  containerProps={{ style: { resize: "vertical" } }}
                />
              </div>
            </div>

            <br />

            <h3 className="text-[18px] font-[500] mb-1 text-black">Image</h3>

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
                url="/api/blog/uploadImages"
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
    </>
  );
};

export default AddBlog;
