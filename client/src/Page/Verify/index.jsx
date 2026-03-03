import React, { useContext, useState } from 'react';
import OtpBox from '../../componets/OtpBox';
import { Button } from '@mui/material';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';

const Verify = () => {
  const [otp, setOtp] = useState('');

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const history = useNavigate();
  const context = useContext(MyContext);

  // useEffect(()=> {

  // },[])

  const verityOTP = (e) => {
    e.preventDefault();
    postData('/api/user/verifyEmail', {
      email: localStorage.getItem('userEmail'),
      otp: otp,
    }).then((res) => {
      if (res?.error === false) {
        console.log(res);
        context.alertBox('success', res?.message);
        localStorage.removeItem('userEmail');
        history('/login');
      } else {
        context.alertBox('success', res?.message);
      }
    });
  };

  return (
    <>
      <section className="section py-10">
        <div className="container">
          <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
            <div className="text-center flex items-center justify-center">
              <img src="/verify.png" width={100} />
            </div>
            <h3 className="text-center text-[18px] text-black mt-4 mb-1">Verify OTP</h3>

            <p className="text-center mt-0 mb-4">
              OTP send to{' '}
              <span className="text-primary font-bold">{localStorage.getItem('userEmail')}</span>
            </p>

            <form onSubmit={verityOTP}>
              <OtpBox length={6} onChange={handleOtpChange} />

              <div className="flex items-center justify-center mt-5 px-3">
                <Button type="submit" className="w-full bg-org btn-lg">
                  Verify OTP
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Verify;
