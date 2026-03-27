import React, { useContext, useEffect, useState } from 'react';
import { Link, Links } from 'react-router-dom';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { Button } from '@mui/material';
import { MyContext } from '../../App';
import { deleteData } from '../../utils/api';

const CartPanel = (props) => {
  const context = useContext(MyContext);

  const removeItem = (id) => {
    deleteData(`/api/cart/delete-cart-item/${id}`).then((res) => {
      context.alertBox('success', 'Item Removed');
      context?.getCartItems();
    });
  };

  return (
    <>
      <div className="scroll w-full max-h-[350px] overflow-y-scroll overflow-x-hidden py-3 px-4">
        {props?.data?.map((item, index) => {
          return (
            <>
              <div className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4">
                <div className="img w-[25%] overflow-hidden h-[100px] rounded-md">
                  <Link to={`/product/${item?.productId}`} className="block group">
                    <img src={item?.image} className="w-full group-hover:scale-105" />
                  </Link>
                </div>

                <div className="info w-[75%] pr-5 relative pt-3">
                  <h4 className="text-[14px] font-[500]">
                    <Link to={`/product/${item?.productId}`} className="link transition-all">
                      {item?.productTitle?.substr(0, 40) + '...'}
                    </Link>
                  </h4>
                  <p className="flex items-center gap-5 mt-2 mb-2">
                    Qty : <span>{item?.quantity}</span>
                    <span className="text-primary font-bold">Price : &#8363; {item?.price}</span>
                  </p>

                  <MdOutlineDeleteOutline
                    className="absolute top-[10px] right-[10px] 
                      cursor-pointer text-[20px] link transition-all"
                    onClick={() => removeItem(item?._id)}
                  />
                </div>
              </div>
            </>
          );
        })}
      </div>

      <br />

      <div className="bottomSec absolute bottom-[10px] left-[10px] w-full overflow-hidden pr-5">
        <div
          className="bottomInfo py-3 px-4 w-full border-t border-[rgba(0,0,0,0.1)] flex items-center 
            justify-between flex-col"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">{context?.cartData?.length} item</span>
            <span className="text-primary font-bold">
              {(context?.cartData?.length !== 0
                ? context?.cartData
                    ?.map((item) => parseInt(item.price || 0) * (item.quantity || 0))
                    .reduce((total, value) => total + value, 0)
                : 0
              )?.toLocaleString('vi-VN', {
                // Nên dùng 'vi-VN' để hiển thị định dạng số kiểu Việt Nam
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0, // Loại bỏ phần .00 nếu không cần thiết
              })}
            </span>
          </div>
        </div>

        <div
          className="bottomInfo py-3 px-4 w-full border-t border-[rgba(0,0,0,0.1)] flex items-center 
            justify-between flex-col"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">Total (tal excl.)</span>
            <span className="text-primary font-bold">
              {(context?.cartData?.length !== 0
                ? context?.cartData
                    ?.map((item) => parseInt(item.price || 0) * (item.quantity || 0))
                    .reduce((total, value) => total + value, 0)
                : 0
              )?.toLocaleString('vi-VN', {
                // Nên dùng 'vi-VN' để hiển thị định dạng số kiểu Việt Nam
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0, // Loại bỏ phần .00 nếu không cần thiết
              })}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between w-full gap-5 px-3 py-3">
          <Link to="/cart" className="w-[50%] d-block">
            <Button className="bg-org btn-lg w-full">View Cart</Button>
          </Link>
          <Link to="/checkout" className="w-[50%] d-block">
            <Button className="bg-org btn-border btn-lg w-full">Checkout</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CartPanel;
