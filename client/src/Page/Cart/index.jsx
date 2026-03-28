import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { BsFillBagCheckFill } from 'react-icons/bs';
import CartItems from './cartItems';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const context = useContext(MyContext);
  const [productSizeData, setProductSizeData] = useState([]);
  const [producRamData, setProductRamData] = useState([]);
  const [productWeightData, setProductWeightData] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchDataFromApi(`/api/product/productSize/get`).then((res) => {
      if (res?.success === true) {
        setProductSizeData(res?.data); // [{_id, name: "S"}, ...]
      }
    });

    fetchDataFromApi(`/api/product/productRams/get`).then((res) => {
      if (res?.success === true) {
        setProductRamData(res?.data); // [{_id, name: "S"}, ...]
      }
    });

    fetchDataFromApi(`/api/product/productWeight/get`).then((res) => {
      if (res?.success === true) {
        setProductWeightData(res?.data); // [{_id, name: "S"}, ...]
      }
    });
  }, []);

  const selectedSize = (item) => {
    if (item?.size !== '') {
      return item?.size;
    }

    if (item?.ram !== '') {
      return item?.ram;
    }

    if (item?.weight !== '') {
      return item?.weight;
    }
  };

  return (
    <>
      <section className="section py-10 pb-10">
        <div className="container w-[80%] max-w-[80%] flex gap-5">
          <div className="leftPart w-[70%]">
            <div className="shadow-md rounded-md bg-white">
              <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)]">
                <h2>Your Cart</h2>
                <p className="mt-0">
                  There are{' '}
                  <span className="font-bold text-primary">{context?.cartData?.length}</span>{' '}
                  products in your cart
                </p>
              </div>

              {context?.cartData?.length !== 0 ? (
                context?.cartData?.map((item, index) => {
                  return (
                    <CartItems
                      key={index}
                      selectedSize={() => selectedSize(item)}
                      size={item?.size}
                      qty={item?.quantity}
                      item={item}
                      productSizeData={productSizeData}
                      productRamsData={producRamData}
                      productWeightData={productWeightData}
                    />
                  );
                })
              ) : (
                <>
                  <div className="flex items-center justify-center flex-col py-10 gap-5">
                    <img src="/cartfoot.png" className="w-[250px]  " alt="Empty Cart" />
                    <h4>Your Cart is currently empty</h4>
                    <Link to={'/'}>
                      <Button className="bg-org btn-sm">Continue Shopping</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="rightPart w-[30%]">
            <div className="shadow-md rounded-md bg-white p-5 sticky top-[155px] z-[90]">
              <h3 className="pb-3">Cart Totals</h3>
              <hr />
              <p className="flex items-center justify-between">
                <span className="text-[14px] font-[500]">Subtotal</span>
                <span className="text-primary font-bold">
                  &#8363;{' '}
                  {context?.cartData
                    ?.map((item) => parseInt(item.price || 0) * (item.quantity || 0))
                    .reduce((total, value) => total + value, 0)
                    .toLocaleString('vi-VN')}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-[14px] font-[500]">Shipping</span>
                <span className="font-bold">Free</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-[14px] font-[500]">Estimate for</span>
                <span className="font-bold">Việt Nam</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-[14px] font-[500]">Total</span>
                <span className="text-primary font-bold">
                  &#8363;{' '}
                  {context?.cartData
                    ?.map((item) => parseInt(item.price || 0) * (item.quantity || 0))
                    .reduce((total, value) => total + value, 0)
                    .toLocaleString('vi-VN')}
                </span>
              </p>
              <br />
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

export default CartPage;
