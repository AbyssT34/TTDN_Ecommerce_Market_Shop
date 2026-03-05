import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import { CgLogIn } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useContext } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';

const ChangePassword = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isPasswordShow2, setIsPasswordShow2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const context = useContext(MyContext);
  const histoty = useNavigate();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const valideValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const email = localStorage.getItem("userEmail");

    if (!email) {
      context.alertBox("error", "Session expired, please try again");
      setIsLoading(false);
      histoty("/login");
      return false;
    }

    if (formFields.newPassword === "") {
      context.alertBox("error", "Please enter new password");
      setIsLoading(false);
      return false;
    }

    if (formFields.confirmPassword === "") {
      context.alertBox("error", "Please enter confirm password");
      setIsLoading(false);
      return false;
    }

    if (formFields.confirmPassword !== formFields.newPassword) {
      context.alertBox("error", "Password and confirm password not match");
      setIsLoading(false);
      return false;
    }

    postData(`/api/user/forgot-password-reset`, {
      email,
      newPassword: formFields.newPassword,
      confirmPassword: formFields.confirmPassword,
    }).then((res) => {
      if (res?.error === false) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("actionType");
        context.alertBox("success", res?.message);
        setIsLoading(false);
        histoty("/login");
      } else {
        context.alertBox("error", res?.message || "Something went wrong");
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      <section className="bg-white w-full">
        {/* Header */}
        <header className="w-full fixed top-0 left-0 px-4 py-2 flex items-center justify-between z-50 bg-white/80 backdrop-blur-sm">
          <Link to={"/"}>
            <img src="/7_logo.jpg" alt="logo" className="w-[200px]" />
          </Link>
          <div className="flex items-center gap-0">
            <NavLink to="/login" className={({ isActive }) => isActive ? "isActive" : ""}>
              <Button className="!rounded-full !text-[rgba(0,0,0,0.9)] !px-5 flex gap-1">
                <CgLogIn className="text-[18px]" /> Login
              </Button>
            </NavLink>
            <NavLink to="/sign-up" className={({ isActive }) => isActive ? "isActive" : ""}>
              <Button className="!rounded-full !text-[rgba(0,0,0,0.9)] !px-5 flex gap-1">
                <FaRegUser className="text-[14px]" /> Sign Up
              </Button>
            </NavLink>
          </div>
        </header>

        {/* Background */}
        <img src="/login.png" alt="background" className="w-full fixed top-0 left-0 opacity-5" />

        {/* Form Box */}
        <div className="loginBox card w-[600px] h-[auto] pb-20 mx-auto pt-20 bg-white rounded-xl shadow-lg relative z-10 p-8">
          <div className="text-center">
            <img src="/icon.svg" alt="icon" className="m-auto w-[60px]" />
          </div>

          <h1 className="text-center text-[28px] font-[800] mt-4 leading-tight">
            Change Password <br />
            <span className="font-[500] text-[17px] text-gray-600">
              Enter your new password below
            </span>
          </h1>

          <div className="w-full flex items-center justify-center gap-3 mt-6">
            <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
            <span className="text-[14px] font-[500]">Reset your password</span>
            <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
          </div>

          <br />

          <form className="w-full px-4 mt-5" onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="form-group mb-4 w-full">
              <h4 className="text-[14px] font-[500] mb-1">New Password</h4>
              <div className="relative w-full">
                <input
                  type={isPasswordShow ? "text" : "password"}
                  className="w-full h-[50px] border border-[rgba(0,0,0,0.1)] rounded-md 
                             focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                  placeholder="Nhập Password mới của bạn"
                  name="newPassword"
                  value={formFields.newPassword}
                  disabled={isLoading}
                  onChange={onChangeInput}
                />
                <Button
                  className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600"
                  onClick={() => setIsPasswordShow(!isPasswordShow)}
                >
                  {isPasswordShow ? <FaEyeSlash className="text-[18px]" /> : <FaRegEye className="text-[18px]" />}
                </Button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group mb-4 w-full">
              <h4 className="text-[14px] font-[500] mb-1">Confirm Password</h4>
              <div className="relative w-full">
                <input
                  type={isPasswordShow2 ? "text" : "password"}
                  name="confirmPassword"
                  value={formFields.confirmPassword}
                  disabled={isLoading}
                  onChange={onChangeInput}
                  className="w-full h-[50px] border border-[rgba(0,0,0,0.1)] rounded-md 
                             focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                  placeholder="Xác nhận Password mới của bạn"
                />
                <Button
                  className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600"
                  onClick={() => setIsPasswordShow2(!isPasswordShow2)}
                >
                  {isPasswordShow2 ? <FaEyeSlash className="text-[18px]" /> : <FaRegEye className="text-[18px]" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!valideValue}
              className="btn-blue btn-lg w-full"
            >
              {isLoading ? <CircularProgress color="inherit" /> : "Change Password"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default ChangePassword;