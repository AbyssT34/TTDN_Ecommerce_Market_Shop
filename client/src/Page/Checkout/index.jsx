import React, { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { Button } from '@mui/material';
import { MyContext } from '../../App';
import { FaPlus } from 'react-icons/fa';
import Radio from '@mui/material/Radio';

const Checkout = () => {
  const [userData, setUserData] = useState(null);
  const [isChecked, setIsChecked] = useState(0);
  const context = useContext(MyContext);

  useEffect(() => {
    setUserData(context?.userData);
  }, [context?.userData, userData]);

  const editAddress = (id) => {
    context.setOpenAddressPanel(true);
    context.setAddressMode('edit');
    context.setAddressId(id);
  };

  const handleChange = (e, index) => {
    if (e.target.checked) {
      setIsChecked(index);
    }
  };

  return (
    <>
      <section className="py-10">
        <div className="w-[70%] m-auto flex gap-5">
          <div className="leftCol w-[60%]">
            <div className="card bg-white shadow-md p-5 rounded-md w-full">
              <div className="flex items-center justify-between">
                <h2>Select Delivery Address</h2>
                <Button
                  variant="outlined"
                  onClick={() => {
                    context?.setOpenAddressPanel(true);
                    context?.setAddressMode('add');
                  }}
                >
                  <FaPlus /> ADD NEW ADDRESS
                </Button>
              </div>

              <br />

              <div className="flex flex-col gap-4">
                {context?.userData?.address_details?.length !== 0 ? (
                  userData?.address_details?.map((address, index) => {
                    return (
                      <label
                        className={`flex gap-3 p-4 border border-[rgba(0,0,0,0.1)] rounded-md 
                          relative ${isChecked === index && 'bg-[#fff2f2]'} `}
                        key={index}
                      >
                        <div>
                          <Radio
                            size="small"
                            onChange={(e) => handleChange(e, index)}
                            checked={isChecked === index}
                          />
                        </div>
                        <div className="info">
                          <span className="inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md">
                            {address?.addressType}
                          </span>
                          <h3>{userData?.name}</h3>
                          <p className="mt-0 mb-0">
                            {address?.address_line1 +
                              ' ' +
                              address?.city +
                              ' ' +
                              address?.country +
                              ' ' +
                              address?.pincode +
                              ' ' +
                              address?.state +
                              ' ' +
                              address?.lamdmark}
                          </p>
                          <p className="mb-0 font-[500]">+{userData?.mobile}</p>
                        </div>

                        <Button
                          variant="text"
                          className="!absolute top-[15px] right-[15px] btn-sm"
                          size="small"
                          onClick={() => editAddress(address?._id)}
                        >
                          EDIT
                        </Button>
                      </label>
                    );
                  })
                ) : (
                  <>
                    <div className="flex items-center mt-5 justify-between flex-col p-5">
                      <img src="/relocation.png" width="100"  />
                      <h2 className="text-center">No Addresses found in your account</h2>
                      <p className='mt-0'>Add a delivery address.</p>
                      <Button className="bg-org ">ADD ADDRESS</Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="rightCol w-[40%]">
            <div className="card shadow-md bg-white p-5 rounded-md">
              <h2 className="mb-4">Your Order</h2>

              <div className="flex items-center justify-between py-3 border-t border-b border-[rgba(0,0,0,0.1)]">
                <span className="text-[14px] font-[600]">product</span>
                <span className="text-[14px] font-[600]">Subtotal</span>
              </div>
              <div className="mb-5 scroll max-h-[300px] overflow-y-scroll overflow-x-hidden pr-2">
                {context?.cartData?.length !== 0 &&
                  context?.cartData?.map((item, index) => {
                    return (
                      <>
                        <div className="flex items-center justify-between py-2" key={index}>
                          <div className="part1 flex items-center gap-3">
                            <div className="img w-[60px] h-[60px] object-cover overflow-hidden rounded-md group cursor-pointer">
                              <img
                                src={item?.image}
                                className="w-full transition-all group-hover:scale-105"
                              />
                            </div>

                            <div className="info">
                              <h4 className="text-[14px]" title={item?.productTitle}>
                                {item?.productTitle?.substr(0, 20) + '...'}
                              </h4>
                              <span className="text-[13px]">Qty : {item?.quantity} </span>
                            </div>
                          </div>

                          <span className="text-[14px] font-[500]">
                            {' '}
                            {(item?.quantity * item?.price)?.toLocaleString('vi-VN', {
                              // Nên dùng 'vi-VN' để hiển thị định dạng số kiểu Việt Nam
                              style: 'currency',
                              currency: 'VND',
                              minimumFractionDigits: 0, // Loại bỏ phần .00 nếu không cần thiết
                            })}
                          </span>
                        </div>
                      </>
                    );
                  })}
              </div>

              <Button className="bg-org btn-lg w-full flex gap-2">
                <BsFillBagCheckFill className="text-[20px]" /> Checkout
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
