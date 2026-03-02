import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import { FcGoogle } from "react-icons/fc";
import { CgLogIn } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
import { BsFacebook } from "react-icons/bs";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isPasswordShow, setIsPasswordShow] = useState("");
  const [isPasswordShow2, setIsPasswordShow2] = useState("");

  return (
    <>
      <section className="bg-white w-full ">
        {/* =========== Header =========== */}
        <header className="w-full fixed top-0 left-0 px-4 py-2 flex items-center justify-between z-50 bg-white/80 backdrop-blur-sm">
          <Link to={"/"}>
            <img src="/7_logo.jpg" alt="logo" className="w-[200px]" />
          </Link>

          <div className="flex items-center gap-0">
            {" "}
            <NavLink to="/Login" exact="true" activeClassName="isActive">
              {" "}
              <Button className="!rounded-full !text-[rgba(0,0,0,0.9)] !px-5 flex gap-1">
                {" "}
                <CgLogIn className="text-[18px]" /> Login{" "}
              </Button>{" "}
            </NavLink>{" "}
            <NavLink to="/sign-up" exact="true" activeClassName="isActive">
              <Button className="!rounded-full !text-[rgba(0,0,0,0.9)] !px-5 flex gap-1">
                {" "}
                <FaRegUser className="text-[14px]" /> Sign Up{" "}
              </Button>
            </NavLink>
          </div>
        </header>

        {/* =========== Background =========== */}
        <img
          src="/login.png"
          alt="background"
          className="w-full fixed top-0 left-0 opacity-5"
        />

        {/* =========== Login Box =========== */}
        <div className="loginBox card w-[600px] h-[auto] pb-20 mx-auto pt-20 bg-white rounded-xl shadow-lg relative z-10 p-8">
          <div className="text-center">
            <img src="/icon.svg" alt="icon" className="m-auto w-[60px]" />
          </div>

          <h1 className="text-center text-[28px] font-[800] mt-4 leading-tight">
            Welcome Back! <br />
            You can change your password from here
          </h1>

          {/* =========== Divider =========== */}
          <div className="w-full flex items-center justify-center gap-3 mt-6">
            <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
            <span className="text-[14px] font-[500]">
              Or, Sign in with your email
            </span>
            <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
          </div>

          <br />

          {/* =========== Email Form =========== */}
          <form className="w-full px-4 mt-5">
            <div className="form-group mb-4 w-full">
              <h4 className="text-[14px] font-[500] mb-1">New Password</h4>
              <div className="relative w-full">
                <input
                  type={isPasswordShow === false ? "password" : "text"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[50px] border border-[rgba(0,0,0,0.1)] rounded-md 
                           focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                  placeholder="Nhập Password mới của bạn"
                />
                <Button
                  className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] 
                !-min-w-[35px] !text-gray-600"
                  onClick={() => setIsPasswordShow(!isPasswordShow)}
                >
                  {isPasswordShow === false ? (
                    <FaRegEye className="text-[18px]" />
                  ) : (
                    <FaEyeSlash className="text-[18px]" />
                  )}
                </Button>
              </div>
            </div>

            <div className="form-group mb-4 w-full">
              <h4 className="text-[14px] font-[500] mb-1">Confirm Password</h4>
              <div className="relative w-full">
                <input
                  type={isPasswordShow2 === false ? "password" : "text"}
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className="w-full h-[50px] border border-[rgba(0,0,0,0.1)] rounded-md 
                           focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                  placeholder="Nhập Password mới của bạn"
                />
                <Button
                  className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] 
                !-min-w-[35px] !text-gray-600"
                  onClick={() => setIsPasswordShow2(!isPasswordShow2)}
                >
                  {isPasswordShow2 === false ? (
                    <FaRegEye className="text-[18px]" />
                  ) : (
                    <FaEyeSlash className="text-[18px]" />
                  )}
                </Button>
              </div>
            </div>

            <Button className="btn-blue btn-lg w-full">Change Password</Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default ChangePassword;
