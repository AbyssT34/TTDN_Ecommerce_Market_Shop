import Button from '@mui/material/Button';
import React, { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import AccountSidebar from '../../componets/AccountSidebar';
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { editData, postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { Collapse } from 'react-collapse';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const MyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isChangePasswordFromShow, setIsChangePasswordFromShow] = useState(false);
  const [phone, setPhone] = useState('');

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
    if (token === null) history('/');
  }, [context?.islogin]);

  // ✅ Tách riêng 2 hàm onChange tránh conflict
  const onChangeProfileInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const onChangePasswordInput = (e) => {
    const { name, value } = e.target;
    setChangePassword((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (context?.userData?._id) {
      setUserId(context?.userData?._id);
      setFormFields({
        email: context?.userData?.email || '',
        mobile: context?.userData?.mobile || '',
        name: context?.userData?.name || '',
      });
      setPhone(`${context?.userData?.mobile || ''}`);
      setChangePassword((prev) => ({
        ...prev,
        email: context?.userData?.email || '',
      }));
    }
  }, [context?.userData]);

  const valideValue = Object.values(formFields).every((el) => el);
  const valideValue2 = Object.values(changePassword).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.name) {
      context.alertBox('error', 'Please enter full name');
      setIsLoading(false);
      return;
    }
    if (!formFields.email) {
      context.alertBox('error', 'Please enter email id');
      setIsLoading(false);
      return;
    }
    if (!formFields.mobile) {
      context.alertBox('error', 'Please enter mobile number');
      setIsLoading(false);
      return;
    }

    editData(`/api/user/${userId}`, formFields, { withCredentials: true }).then((res) => {
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

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    setIsLoading2(true);

    // ✅ Chỉ check oldPassword khi KHÔNG đăng nhập Google
    if (context?.userData?.signUpWithGoogle === false && !changePassword.oldPassword) {
      context.alertBox('error', 'Please enter old password');
      setIsLoading2(false);
      return;
    }
    if (!changePassword.newPassword) {
      context.alertBox('error', 'Please enter new password');
      setIsLoading2(false);
      return;
    }
    if (!changePassword.confirmPassword) {
      context.alertBox('error', 'Please confirm new password');
      setIsLoading2(false);
      return;
    }
    if (changePassword.confirmPassword !== changePassword.newPassword) {
      context.alertBox('error', 'New password and confirm password do not match');
      setIsLoading2(false);
      return;
    }

    postData(`/api/user/reset-password`, changePassword)
      .then((res) => {
        setIsLoading2(false);
        if (res?.error !== true) {
          context.alertBox('success', res?.message);
          setChangePassword((prev) => ({
            ...prev,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          }));
        } else {
          context.alertBox('error', res?.message || 'Something went wrong');
        }
      })
      .catch(() => {
        setIsLoading2(false);
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
            {/* Profile Form */}
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
                      type="text"
                      label="Full Name"
                      variant="outlined"
                      size="small"
                      className="w-full"
                      name="name"
                      value={formFields.name}
                      onChange={onChangeProfileInput}
                      disabled={isLoading}
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
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="flex items-center mt-4 gap-5">
                  <div className="w-[50%]">
                    <PhoneInput
                      defaultCountry="vn"
                      value={phone}
                      disabled={isLoading}
                      onChange={(phone) => {
                        setPhone(phone);
                        setFormFields((prev) => ({ ...prev, mobile: phone }));
                      }}
                    />
                  </div>
                </div>

                <br />
                <Button
                  type="submit"
                  disabled={!valideValue}
                  className="bg-org btn-lg"
                  sx={{ width: '180px', height: '42px', fontSize: '14px', whiteSpace: 'nowrap' }}
                >
                  {isLoading ? <CircularProgress color="inherit" /> : 'Update Profile'}
                </Button>
              </form>
            </div>

            {/* Change Password Form */}
            <Collapse isOpened={isChangePasswordFromShow}>
              <div className="card bg-white p-5 shadow-md rounded-md">
                <div className="flex items-center pb-3">
                  <h2 className="pb-0">Change Password</h2>
                </div>
                <hr />

                <form className="mt-5" onSubmit={handleSubmitChangePassword}>
                  <div className="grid grid-cols-2 gap-5">
                    {/* ✅ Old Password - chỉ hiện khi KHÔNG đăng nhập Google */}
                    {context?.userData?.signUpWithGoogle === false && (
                      <div className="col">
                        <TextField
                          type="password"
                          label="Old Password"
                          variant="outlined"
                          size="small"
                          className="w-full"
                          name="oldPassword"
                          value={changePassword.oldPassword}
                          onChange={onChangePasswordInput}
                          disabled={isLoading2}
                        />
                      </div>
                    )}

                    {/* ✅ New Password - luôn hiện */}
                    <div className="col">
                      <TextField
                        type="password"
                        label="New Password"
                        variant="outlined"
                        size="small"
                        className="w-full"
                        name="newPassword"
                        value={changePassword.newPassword}
                        onChange={onChangePasswordInput}
                        disabled={isLoading2}
                      />
                    </div>

                    {/* ✅ Confirm Password - luôn hiện */}
                    <div className="col">
                      <TextField
                        type="password"
                        label="Confirm Password"
                        variant="outlined"
                        size="small"
                        className="w-full"
                        name="confirmPassword"
                        value={changePassword.confirmPassword}
                        onChange={onChangePasswordInput}
                        disabled={isLoading2}
                      />
                    </div>
                  </div>

                  <br />
                  <Button
                    type="submit"
                    className="bg-org btn-lg"
                    sx={{ width: '180px', height: '42px', fontSize: '14px', whiteSpace: 'nowrap' }}
                  >
                    {isLoading2 ? <CircularProgress color="inherit" /> : 'Change Password'}
                  </Button>
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
