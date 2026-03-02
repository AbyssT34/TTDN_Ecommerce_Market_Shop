import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { FaRegEye } from 'react-icons/fa6';
import { Button } from '@mui/material';
import { IoEyeOff } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
  const [isShowPassWord, setIsShowPassword] = useState(false);

  return (
    <>
      <section className="section py-10">
        <div className="container">
          <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
            <h3 className="text-center text-[18px] text-black">Register with a new account</h3>

            <form className="w-full mt-5">
              <div className="form-gourp w-full mb-5">
                <TextField
                  type="text"
                  id="name"
                  label="Full Name*"
                  variant="outlined"
                  className="w-full"
                />
              </div>

              <div className="form-gourp w-full mb-5">
                <TextField
                  type="email"
                  id="email"
                  label="Email Id*"
                  variant="outlined"
                  className="w-full"
                />
              </div>

              <div className="form-gourp w-full mb-5 relative">
                <TextField
                  type={isShowPassWord === false ? 'password' : 'text'}
                  id="password"
                  label="Password*"
                  variant="outlined"
                  className="w-full"
                />
                <Button
                  className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[30px] 
                        !min-w-[35px] ~rounded-full !text-black opacity-75"
                  onClick={() => setIsShowPassword(!isShowPassWord)}
                >
                  {isShowPassWord === false ? (
                    <FaRegEye className="text-[20px] opacity-75" />
                  ) : (
                    <IoEyeOff className="text-[20px] opacity-75" />
                  )}
                </Button>
              </div>

              <div className="flex items-center w-full mt-3 mb-3">
                <Button className="bg-org btn-lg w-full">Register</Button>
              </div>

              <p className="text-center">
                Already have an account?{' '}
                <Link className="link text-[14px] font-[600] text-primary" to={'/Login'}>
                  Login
                </Link>
              </p>

              <p className="text-center font-[500]">Or continue with social account</p>

              <Button className="flex gap-3 w-full !bg-[#f1f1f1] btn-lg !text-black">
                <FcGoogle className="text-[20px]" />
                Login with Google
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
