import React, { useState } from 'react';

const OtpBox = ({ length, onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return; // Chỉ cho phép số

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);
    onChange(newOTP.join(''));

    // Tự động focus sang ô tiếp theo
    if (value && index < length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Nếu Backspace mà ô rỗng thì quay lại ô trước
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }} className="otpBox">
      {otp.map((data, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          maxLength="1"
          value={otp[index]}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-[45px] h-[45px] text-center text-[17px]"
        />
      ))}
    </div>
  );
};

export default OtpBox;
