import Button from '@mui/material/Button';
import React, { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import AccountSidebar from '../../componets/AccountSidebar';
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { editData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';

const MyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    mobile: '',
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
  };

  useEffect(() => {
    if (context?.userData?._id !== '' && context?.userData?._id !== undefined) {
      setUserId(context?.userData?._id);
      setFormFields({
        email: context?.userData?.email || '',
        mobile: context?.userData?.mobile || '',
        name: context?.userData?.name || '',
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

  return (
    <>
      <section className="py-10 w-full">
        <div className="container flex gap-5">
          <div className="col1 w-[20%]">
            <AccountSidebar />
          </div>
          <div className="col2 w-[50%]">
            <div className="card bg-white p-5 shadow-md rounded-md">
              <h2 className="pb-3">My Profile</h2>
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
                    <TextField
                      label="Phone Number"
                      variant="outlined"
                      size="small"
                      className="w-full"
                      name="mobile"
                      value={formFields.mobile}
                      onChange={onChangeInput}
                      disabled={isLoading === true ? true : false}
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
          </div>
        </div>
      </section>
    </>
  );
};

export default MyAccount;
