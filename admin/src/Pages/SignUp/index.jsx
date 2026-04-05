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
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";


const SignUp = () => {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFb, setLoadingFb] = useState(false);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [isPasswordShow, setIsPasswordShow] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
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

  function handleClickGoogle() {
    setLoadingGoogle(true);
  }

  function handleClickFb() {
    setLoadingFb(true);
  }

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

    if (formFields.password === "") {
      context.alertBox("error", "Please enter password");
      return false;
    }

    postData("/api/user/register", formFields).then((res) => {
      console.log(res);
      if (res?.error !== true) {
        setIsLoading(false);
        context.alertBox("success", res?.message);
        localStorage.setItem("userEmail", formFields.email);
        setFormFields({
          name: "",
          email: "",
          password: "",
        });
        history("/verify-account");
      } else {
        context.alertBox("error", res?.message || "Something went wrong");
        setIsLoading(false);
      }
    });
  };

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
            Join us today! Get special <br />
            <span className="font-[500] text-[17px] text-gray-600">
              benefits and stay up-to-date
            </span>
          </h1>

          {/* =========== Social Login Buttons =========== */}
          <div className="flex items-center justify-center w-full mt-6 gap-4">
            <Button
              size="small"
              onClick={handleClickGoogle}
              endIcon={<FcGoogle />}
              variant="outlined"
              className="!bg-none !py-2 !text-[15px] !capitalize !px-5 !text-[rgba(0,0,0,0.9)]"
            >
              {loadingGoogle ? "Loading..." : "Signin with Google"}
            </Button>

            <Button
              size="small"
              onClick={handleClickFb}
              endIcon={<BsFacebook />}
              variant="outlined"
              className="!bg-none !py-2 !text-[15px] !capitalize !px-5 !text-[rgba(0,0,0,0.9)]"
            >
              {loadingFb ? "Loading..." : "Signin with Facebook"}
            </Button>
          </div>

          {/* =========== Divider =========== */}
          <div className="w-full flex items-center justify-center gap-3 mt-6">
            <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
            <span className="text-[14px] font-[500]">
              Or, Sign in with your email
            </span>
            <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
          </div>

          {/* =========== Email Form =========== */}
          <form className="w-full px-4 mt-5" onSubmit={handleSubmit}>
            <div className="form-group mb-4 w-full">
              <h4 className="text-[14px] font-[500] mb-1">Full Name</h4>
              <input
                type="text"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[50px] border border-[rgba(0,0,0,0.1)] rounded-md 
                           focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                placeholder="Nhập tên của bạn"
                name="name"
                value={formFields.name}
                disabled={isLoading === true ? true : false}
                onChange={onChangeInput}
              />
            </div>

            <div className="form-group mb-4 w-full">
              <h4 className="text-[14px] font-[500] mb-1">Email</h4>
              <input
                type="email"
                className="w-full h-[50px] border border-[rgba(0,0,0,0.1)] rounded-md 
             focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                placeholder="Nhập email của bạn"
                name="email"
                value={formFields.email}
                disabled={isLoading}
                onChange={onChangeInput}
              />
            </div>

            <div className="form-group mb-4 w-full">
              <h4 className="text-[14px] font-[500] mb-1">Password</h4>
              <div className="relative w-full">
                <input
                  type={isPasswordShow === false ? "password" : "text"}
                  className="w-full h-[50px] border border-[rgba(0,0,0,0.1)] rounded-md 
             focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                  placeholder="Nhập Password của bạn"
                  name="password"
                  value={formFields.password}
                  disabled={isLoading}
                  onChange={onChangeInput}
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

            <div className="form-gruop mb-4 w-full flex items-center justify-between">
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Remember Me"
              />
              <Link
                to={"/forgot-password"}
                className="text-[#3872fa] font-[700] text-[15px] hover:underline hover:text-gray-700"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="btn-blue btn-lg w-full"
              disabled={!valideValue}
            >
              {" "}
              {isLoading === true ? (
                <CircularProgress color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default SignUp;
