import React, { useContext, useState } from 'react';
import TextField from '@mui/material/TextField';
import { FaRegEye } from 'react-icons/fa6';
import { Button } from '@mui/material';
import { IoEyeOff } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { MyContext } from '../../App';

const ForgotPassword = () => {
  const [isShowPassWord, setIsShowPassword] = useState(false);
  const [isShowPassWord2, setIsShowPassword2] = useState(false);

  const context = useContext(MyContext);
  const histoty = useNavigate();

  return (
    <>
      <section className="section py-10">
        <div className="container">
          <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
            <h3 className="text-center text-[18px] text-black">Forgot Password</h3>

            <form className="w-full mt-5">
              <div className="form-gourp w-full mb-5 relative">
                <TextField
                  type={isShowPassWord === false ? 'password' : 'text'}
                  id="password"
                  label="New Password*"
                  variant="outlined"
                  className="w-full"
                  name="name"
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

              <div className="form-gourp w-full mb-5 relative">
                <TextField
                  type={isShowPassWord2 === false ? 'password' : 'text'}
                  id="confirm_password"
                  label="Confirm Password*"
                  variant="outlined"
                  className="w-full"
                  name="password"
                />
                <Button
                  className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[30px] 
                        !min-w-[35px] ~rounded-full !text-black opacity-75"
                  onClick={() => setIsShowPassword2(!isShowPassWord2)}
                >
                  {isShowPassWord2 === false ? (
                    <FaRegEye className="text-[20px] opacity-75" />
                  ) : (
                    <IoEyeOff className="text-[20px] opacity-75" />
                  )}
                </Button>
              </div>

              <div className="flex items-center w-full mt-3 mb-3">
                <Button className="bg-org btn-lg w-full">Change Password</Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
