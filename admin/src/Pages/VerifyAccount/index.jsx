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
import OtpBox from "../../Components/OtpBox";

const VerifyAccount = () => {
  const [otp, setOtp] = useState("");

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  return (
    <>
      <section className="bg-white w-full h-[100vh]">
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
            <img src="/verify.png" alt="" className="w-[120px] m-auto" />
          </div>

          <h1 className="text-center text-[28px] font-[800] mt-4 leading-tight">
            Welcome Back! <br />
            Please Verify Your Email
          </h1>

          <br />

          <p className="text-center text-[15px]">
            OTP send to &nbsp;
            <span className="text-primary font-bold">
              quocvinhtran.0212@gmail.com
            </span>
          </p>

          <br />

          <div className="text-center flex items-center justify-center flex-col">
            <OtpBox length={6} onChange={handleOtpChange} />
          </div>

          <br />

          <div className="w-[300px] m-auto">
            <Button className="btn-blue w-full">Verify OTP</Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default VerifyAccount;
