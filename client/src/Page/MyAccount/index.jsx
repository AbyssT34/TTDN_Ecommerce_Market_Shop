import Button from '@mui/material/Button';
import React, { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import AccountSidebar from '../../componets/AccountSidebar';
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { editData, postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { Collapse } from 'react-collapse';
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Radio from "@mui/material/Radio";

const MyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isChangePasswordFromShow, setIsChangePasswordFromShow] = useState(false);
  const [phone, setPhone] = useState("");
  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    mobile: '',
  });

  const [changePassword, setChangePassword] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accesstoken');

    if (token === null) {
      history('/');
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
    if (context?.userData?._id !== '' && context?.userData?._id !== undefined) {
      setUserId(context?.userData?._id);
      setFormFields({
        email: context?.userData?.email || '',
        mobile: context?.userData?.mobile || '',
        name: context?.userData?.name || '',
      });
      const ph = `${context?.userData?.mobile}`;
       setPhone(ph);
      setChangePassword({
        email: context?.userData?.email || '',
      });
    }
  }, [context?.userData]);

  const valideValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.name === '') {
      context.alertBox('error', 'Please enter full name');
      return false;
    }

    if (formFields.email === '') {
      context.alertBox('error', 'Please enter email id');
      return false;
    }

    if (formFields.mobile === '') {
      context.alertBox('error', 'Please enter mobile number');
      return false;
    }

    editData(`/api/user/${userId}`, formFields, { withCredentials: true }).then((res) => {
      console.log(res);
      if (res?.error !== true) {
        setIsLoading(false);
        context.alertBox('success', res?.data?.message);

        context.setIsLogin(true);
      } else {
        context.alertBox('error', res?.data?.message || 'Something went wrong');
        setIsLoading(false);
      }
    });
  };

  const valideValue2 = Object.values(changePassword).every((el) => el);

 const handleSubmitChangePassword = (e) => {
  e.preventDefault();
  setIsLoading2(true);

  if (changePassword.oldPassword === '') {
    context.alertBox('error', 'Please enter old password');
    setIsLoading2(false); // ✅
    return false;
  }
  if (changePassword.newPassword === '') {
    context.alertBox('error', 'Please enter new password');
    setIsLoading2(false); // ✅
    return false;
  }
  if (changePassword.confirmPassword === '') {
    context.alertBox('error', 'Please confirm new password');
    setIsLoading2(false); // ✅
    return false;
  }
  if (changePassword.confirmPassword !== changePassword.newPassword) {
    context.alertBox('error', 'New password and confirm password do not match');
    setIsLoading2(false); // ✅ đây là chỗ bị thiếu khi new !== confirm
    return false;
  }

  postData(`/api/user/reset-password`, changePassword).then((res) => {
    if (res?.error !== true) {
      setIsLoading2(false);
      context.alertBox('success', res?.message);
    } else {
      context.alertBox('error', res?.message || 'Something went wrong');
      setIsLoading2(false);
    }
  }).catch(() => {
    setIsLoading2(false); // ✅ thêm catch phòng lỗi network
    context.alertBox('error', 'Something went wrong');
  });
};

  return (
    <>
      <section className="py-10 w-full">
        <div className="container flex gap-5">
          <div className="col1 w-[20%]">
            <AccountSidebar />
          </div>
          <div className="col2 w-[50%]">
            <div className="card bg-white p-5 shadow-md rounded-md mb-5">
              <div className="flex items-center pb-3">
                <h2 className="pb-0">My Profile</h2>
                <Button
                  className="!ml-auto"
                  onClick={() => setIsChangePasswordFromShow(!isChangePasswordFromShow)}
                >
                  Change Password
                </Button>
              </div>
              <hr />

              <form className="mt-5" onSubmit={handleSubmit}>
                <div className="flex items-center gap-5">
                  <div className="w-[50%]">
                    <TextField
                      type="name"
                      label="Full Name"
                      variant="outlined"
                      size="small"
                      className="w-full"
                      name="name"
                      value={formFields.name}
                      onChange={onChangeInput}
                      disabled={isLoading === true ? true : false}
                    />
                  </div>

                  <div className="w-[50%]">
                    <TextField
                      type="email"
                      label="Email"
                      variant="outlined"
                      size="small"
                      className="w-full"
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
                </div>
                <br />
                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={!valideValue}
                    className="bg-org btn-lg"
                    sx={{
                      width: '180px',
                      height: '42px',
                      fontSize: '14px',
                      whiteSpace: 'nowrap', // ✅ không xuống dòng
                    }}
                  >
                    {isLoading === true ? <CircularProgress color="inherit" /> : 'Update Profile'}
                  </Button>
                </div>
              </form>
            </div>


            <Collapse isOpened={isChangePasswordFromShow}>
              <div className="card bg-white p-5 shadow-md rounded-md">
                <div className="flex items-center pb-3">
                  <h2 className="pb-0">Change Passwor</h2>
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
                      className="bg-org btn-lg"
                      sx={{
                        width: '180px',
                        height: '42px',
                        fontSize: '14px',
                        whiteSpace: 'nowrap', // ✅ không xuống dòng
                      }}
                    >
                      {isLoading2 === true ? (
                        <CircularProgress color="inherit" />
                      ) : (
                        'Change Password'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Collapse>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyAccount;
