import React, { useContext, useState } from 'react';
import TextField from '@mui/material/TextField';
import { FaRegEye } from 'react-icons/fa6';
import { Button } from '@mui/material';
import { IoEyeOff } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { MyContext } from '../../App';

const Register = () => {
  const [isShowPassWord, setIsShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    password: '',
  });

  const context = useContext(MyContext);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formFields.name === '') {
      context.openAlertBox('error', 'Please add full name');
      return false;
    }

    postData('/api/register', formFields).then((res) => {
      console.log(res);
    });
  };

  return (
    <>
      <section className="section py-10">
        <div className="container">
          <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
            <h3 className="text-center text-[18px] text-black">Register with a new account</h3>

            <form className="w-full mt-5" onSubmit={handleSubmit}>
              <div className="form-gourp w-full mb-5">
                <TextField
                  type="text"
                  id="name"
                  name="name"
                  label="Full Name*"
                  variant="outlined"
                  className="w-full"
                  onChange={onChangeInput}
                />
              </div>

              <div className="form-gourp w-full mb-5">
                <TextField
                  type="email"
                  id="email"
                  name="email"
                  label="Email Id*"
                  variant="outlined"
                  className="w-full"
                  onChange={onChangeInput}
                />
              </div>

              <div className="form-gourp w-full mb-5 relative">
                <TextField
                  type={isShowPassWord === false ? 'password' : 'text'}
                  id="password"
                  name="password"
                  label="Password*"
                  variant="outlined"
                  className="w-full"
                  onChange={onChangeInput}
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
                <Button type="submit" className="bg-org btn-lg w-full">
                  Register
                </Button>
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
