import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { fetchDataFromApi, uploadImage } from "../../utils/api";
import { editData, postData } from "../../utils/api";
import { IoMdCloudUpload } from "react-icons/io";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Collapse } from "react-collapse";
import Radio from "@mui/material/Radio";
const label = { inputProps: { "arial-label": "checkbox demo" } };

const Profile = () => {
  const [previews, setPreviews] = useState([]);
  const [phone, setPhone] = useState("");
  const [uploading, setUploading] = useState(false);
  const [address, setAddress] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isChangePasswordFromShow, setIsChangePasswordFromShow] =
    useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [changePassword, setChangePassword] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const history = useNavigate();
  const context = useContext(MyContext);

  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");

    if (token === null) {
      history("/login");
    }
  }, [context?.islogin]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });

    setChangePassword(() => {
      return {
        ...changePassword,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
      fetchDataFromApi(
        `/api/address/get?userId=${context?.userData?._id}`,
      ).then((res) => {
        setAddress(res.data);
        context?.setAddress(res.data);
      });
      setUserId(context?.userData?._id);
      setFormFields({
        email: context?.userData?.email || "",
        mobile: context?.userData?.mobile || "",
        name: context?.userData?.name || "",
      });
      const ph = `${context?.userData?.mobile}`;

      setPhone(ph);

      setChangePassword({
        email: context?.userData?.email || "",
      });
    }
  }, [context?.userData]);

  const valideValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.name === "") {
      context.alertBox("error", "Please enter full name");
      return false;
    }

    if (formFields.email === "") {
      context.alertBox("error", "Please enter email id");
      return false;
    }

    if (formFields.mobile === "") {
      context.alertBox("error", "Please enter mobile number");
      return false;
    }

    editData(`/api/user/${userId}`, formFields, { withCredentials: true }).then(
      (res) => {
        console.log(res);
        if (res?.error !== true) {
          setIsLoading(false);
          context.alertBox("success", res?.data?.message);

          context.setIsLogin(true);
        } else {
          context.alertBox(
            "error",
            res?.data?.message || "Something went wrong",
          );
          setIsLoading(false);
        }
      },
    );
  };
  const valideValue2 = Object.values(changePassword).every((el) => el);

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    setIsLoading2(true);

    if (changePassword.oldPassword === "") {
      context.alertBox("error", "Please enter old password");
      setIsLoading2(false); // ✅
      return false;
    }
    if (changePassword.newPassword === "") {
      context.alertBox("error", "Please enter new password");
      setIsLoading2(false); // ✅
      return false;
    }
    if (changePassword.confirmPassword === "") {
      context.alertBox("error", "Please confirm new password");
      setIsLoading2(false); // ✅
      return false;
    }
    if (changePassword.confirmPassword !== changePassword.newPassword) {
      context.alertBox(
        "error",
        "New password and confirm password do not match",
      );
      setIsLoading2(false); // ✅ đây là chỗ bị thiếu khi new !== confirm
      return false;
    }

    postData(`/api/user/reset-password`, changePassword)
      .then((res) => {
        if (res?.error !== true) {
          setIsLoading2(false);
          context.alertBox("success", res?.message);
        } else {
          context.alertBox("error", res?.message || "Something went wrong");
          setIsLoading2(false);
        }
      })
      .catch(() => {
        setIsLoading2(false); // ✅ thêm catch phòng lỗi network
        context.alertBox("error", "Something went wrong");
      });
  };

  useEffect(() => {
    const userAvtar = [];
    if (
      context?.userData?.avatar !== "" &&
      context?.userData?.avatar !== undefined
    ) {
      userAvtar.push(context?.userData?.avatar);
      setPreviews(userAvtar);
    }
  }, [context?.userData]);

  // ❌ Lỗi phổ biến - formData dùng lại giữa các lần upload
  // khai báo ngoài hàm → bị tích lũy data cũ

  // ✅ Fix - khai báo mới mỗi lần gọi
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
          formData.append("images", file); // ✅ field name phải khớp upload.single('images')
        } else {
          context.alertBox(
            "error",
            "Please select a valid JPG, PNG or webp image file",
          );
          setUploading(false);
          return false;
        }
      }

      uploadImage("/api/user/user-avatar", formData)
        .then((res) => {
          setUploading(false);
          if (res?.data?.avatar) {
            setPreviews([res.data.avatar]);
          }
        })
        .catch(() => {
          setUploading(false);
          context.alertBox("error", "Upload failed");
        });
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <>
      <div className="card my-4 pt-5 w-[65%] shadow-md sm:rounded-lg bg-white px-5 pb-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-[700]">Users Profile </h2>

          <Button
            className="!ml-auto"
            onClick={() =>
              setIsChangePasswordFromShow(!isChangePasswordFromShow)
            }
          >
            Change Password
          </Button>
        </div>

        <br />

        <div
          className="w-[110px] h-[110px] rounded-full overflow-hidden mb-4 relative group 
          flex items-center justify-center bg-gray-200"
        >
          {uploading === true ? (
            <CircularProgress color="inherit" />
          ) : (
            <>
              {
                previews?.length !== 0 ? (
                  previews?.map((img, index) => (
                    <img
                      src={img}
                      key={index}
                      className="w-full h-full object-cover"
                    />
                  ))
                ) : (
                  <img src="/user.jpg" className="w-full h-full object-cover" />
                ) // ✅ ternary đúng cách
              }
            </>
          )}

          <div
            className="overlay w-[100%] h-[100%] absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.7)] 
                  flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100"
          >
            <IoMdCloudUpload className="text-[#fff] text-[25px] " />
            <input
              type="file"
              className="absolute top-0 left-0 w-full h-full opacity-0"
              accept="image/*"
              onChange={(e) => onChangeFile(e, "/api/user/user-avatar")}
              name="avatar"
            />
          </div>
        </div>

        <form className="form mt-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-5">
            <div className="w-[50%]">
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none
            focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="name"
                value={formFields.name}
                onChange={onChangeInput}
                disabled={isLoading === true ? true : false}
              />
            </div>

            <div className="w-[50%]">
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none
            focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="email"
                value={formFields.email}
                onChange={onChangeInput}
                disabled={true}
              />
            </div>
          </div>

          <div className="flex items-center mt-4 gap-5">
            <div className="w-[50%]">
              <PhoneInput
                defaultCountry="vn"
                value={phone}
                disabled={isLoading === true ? true : false}
                onChange={(phone) => {
                  setPhone(phone);
                  setFormFields({
                    mobile: phone,
                  });
                }}
              />
            </div>
            <div className="w-[50%]"></div>
          </div>

          <br />

          <div
            className="flex items-center justify-center p-5 rounded-md border border-dashed
           border-[rgba(0,0,0,0.2)] bg-[#f1faff] hover:bg-[#e7f3f9] cursor-pointer"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add New Address",
              })
            }
          >
            <span className="text-[14px] font-[500]">Add Address</span>
          </div>

          <div className="flex gap-2 flex-col mt-4">
            {address?.length > 0 &&
              address?.map((address, index) => {
                return (
                  <>
                    <label
                      className="addressBox w-full flex items-center justify-center border border-dashed
           border-[rgba(0,0,0,0.2)] bg-[#f1f1f1] p-3 rounded-md cursor-pointer"
                    >
                      <Radio
                        {...label}
                        name="address"
                        value={address?._id}
                        checked={selectedValue === address?._id}
                        onChange={handleChange}
                      />
                      <span className="text-[12px]">
                        {address?.address_line1 +
                          " " +
                          address?.city +
                          " " +
                          address?.country +
                          " " +
                          address?.state +
                          " " +
                          address?.pincode}
                      </span>
                    </label>
                  </>
                );
              })}
          </div>

          <br />
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={!valideValue}
              className="btn-blue btn-lg w-full"
            >
              {isLoading === true ? (
                <CircularProgress color="inherit" />
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>

        <br />
      </div>

      <Collapse isOpened={isChangePasswordFromShow}>
        <div className="card w-[65%] bg-white p-5 shadow-md rounded-md">
          <div className="flex items-center pb-3">
            <h2 className="pb-0 text-[18px] font-[600]">Change Passwor</h2>
          </div>
          <hr />
          <form className="mt-5" onSubmit={handleSubmitChangePassword}>
            <div className="flex items-center gap-5">
              <div className="w-[50%]">
                <TextField
                  label="Old Password"
                  variant="outlined"
                  size="small"
                  className="w-full"
                  name="oldPassword"
                  value={changePassword.oldPassword}
                  onChange={onChangeInput}
                  disabled={isLoading2 === true ? true : false}
                />
              </div>

              <div className="w-[50%]">
                <TextField
                  type="text"
                  label="New Password"
                  variant="outlined"
                  size="small"
                  className="w-full"
                  name="newPassword"
                  value={changePassword.newPassword}
                  onChange={onChangeInput}
                  disabled={isLoading2 === true ? true : false}
                />
              </div>
            </div>

            <div className="flex items-center mt-4 gap-5">
              <div className="w-[50%]">
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  size="small"
                  className="w-full"
                  name="confirmPassword"
                  value={changePassword.confirmPassword}
                  onChange={onChangeInput}
                  disabled={isLoading2 === true ? true : false}
                />
              </div>
            </div>
            <br />
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={!valideValue2}
                className="btn-blue btn-lg w-full"
              >
                {isLoading2 === true ? (
                  <CircularProgress color="inherit" />
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Collapse>
    </>
  );
};

export default Profile;
