import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GoTriangleDown } from 'react-icons/go';
import { Rating } from '@mui/material';
import { deleteData, editData } from '../../utils/api';
import { MyContext } from '../../App';

const CartItems = (props) => {
  const [sizeAnchorEl, setSizeAnchorEl] = useState(null);
  const [selectedSize, setSelectedSize] = useState(props?.item?.size || '');
  const openSize = Boolean(sizeAnchorEl);

  const [ramAnchorEl, setRamAnchorEl] = useState(null);
  const [selectedRam, setSelectedRam] = useState(props?.item?.ram || '');
  const openRam = Boolean(ramAnchorEl);

  const [weightAnchorEl, setWeightAnchorEl] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(props?.item?.weight || '');
  const openWeight = Boolean(weightAnchorEl);

  const [qtyAnchorEl, setQtyAnchorEl] = useState(null);
  const [selectedQty, setSelectedQty] = useState(props.qty);
  const openQty = Boolean(qtyAnchorEl);

  const context = useContext(MyContext);

  const hasValue = (val) => val && val !== '' && val !== ' ';

  // Size handlers
  const handleClickSize = (event) => setSizeAnchorEl(event.currentTarget);
  const handleCloseSize = (value) => {
    setSizeAnchorEl(null);
    if (value !== null) setSelectedSize(value);
  };

  // Ram handlers
  const handleClickRam = (event) => setRamAnchorEl(event.currentTarget);
  const handleCloseRam = (value) => {
    setRamAnchorEl(null);
    if (value !== null) setSelectedRam(value);
  };

  // Weight handlers
  const handleClickWeight = (event) => setWeightAnchorEl(event.currentTarget);
  const handleCloseWeight = (value) => {
    setWeightAnchorEl(null);
    if (value !== null) setSelectedWeight(value);
  };

  // Qty handlers
  const handleClickQty = (event) => setQtyAnchorEl(event.currentTarget);
  const handleCloseQty = (value) => {
    setQtyAnchorEl(null);
    if (value !== null) {
      setSelectedQty(value);

      const cartObj = {
        _id: props?.item?._id,
        qty: value, //
        subTotal: props?.item?.price * value,
      };

      editData(`/api/cart/update-qty`, cartObj).then((res) => {
        if (res?.data?.error === false) {
          context.alertBox('success', res?.data?.message);
          context?.getCartItems();
        }
      });
    }
  };

  const updateCart = (type, selectedVal, qty) => {
    const cartObj = {
      _id: props?.item?._id,
      qty: qty, //
      subTotal: props?.item?.price * qty,
      size: type === 'size' ? selectedVal : props?.item?.size || '',
      weight: type === 'weight' ? selectedVal : props?.item?.weight || '',
      ram: type === 'ram' ? selectedVal : props?.item?.ram || '',
    };

    editData(`/api/cart/update-qty`, cartObj).then((res) => {
      if (res?.data?.error === false) {
        context.alertBox('success', res?.data?.message);
     context?.getCartItems();
      }
    });
  };

  const removeItem = (id) => {
    deleteData(`/api/cart/delete-cart-item/${id}`).then((res) => {
      context.alertBox('success', 'Product removed from cart');
      context?.getCartItems();
    });
  };

  return (
    <div className="cartItem w-full p-3 flex items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.1)]">
      {/* Ảnh */}
      <div className="img w-[15%] rounded-md overflow-hidden">
        <Link to={`/product/${props?.item?.productId}`} className="group">
          <img
            src={props?.item?.image}
            alt=""
            className="w-full group-hover:scale-105 transition-all"
          />
        </Link>
      </div>

      <div className="info w-[85%] relative">
        <IoCloseSharp
          className="cursor-pointer absolute top-[0px] right-[0px] text-[22px] link transition-all"
          onClick={() => removeItem(props?.item?._id)}
        />

        <span className="text-[13px] text-gray-500">{props?.item?.brand}</span>

        <h3 className="text-[16px]">
          <Link to={`/product/${props?.item?.productId}`} className="link">
            {props?.item?.productTitle}
          </Link>
        </h3>

        <Rating name="size-small" value={props?.item?.rating} size="small" readOnly />

        <div className="flex items-center gap-4 mt-2">
          {/* Size dropdown - chỉ hiện khi item.size có giá trị */}
          {hasValue(props?.item?.size) && props?.productSizeData?.length > 0 && (
            <div className="relative">
              <span
                className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] py-1 px-2 rounded-md cursor-pointer"
                onClick={handleClickSize}
              >
                Size: {selectedSize} <GoTriangleDown />
              </span>
              <Menu
                id="size-menu"
                anchorEl={sizeAnchorEl}
                open={openSize}
                onClose={() => handleCloseSize(null)}
              >
                {props.productSizeData.map((item, index) => (
                  <MenuItem
                    key={index}
                    className={`${item?.name === selectedSize && 'selected'}`}
                    onClick={() => {
                      handleCloseSize(item?.name);
                      updateCart('size', item?.name, props?.item?.quantity);
                    }}
                  >
                    {item?.name}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          )}

          {/* Ram dropdown - chỉ hiện khi item.ram có giá trị */}
          {hasValue(props?.item?.ram) && props?.productRamsData?.length > 0 && (
            <div className="relative">
              <span
                className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] py-1 px-2 rounded-md cursor-pointer"
                onClick={handleClickRam}
              >
                RAM: {selectedRam} <GoTriangleDown />
              </span>
              <Menu
                id="ram-menu"
                anchorEl={ramAnchorEl}
                open={openRam}
                onClose={() => handleCloseRam(null)}
              >
                {props.productRamsData.map((item, index) => (
                  <MenuItem
                    key={index}
                    className={`${item?.name === selectedRam && 'selected'}`}
                    onClick={() => {
                      handleCloseRam(item?.name);
                      updateCart('ram', item?.name, props?.item?.quantity);
                    }}
                  >
                    {item?.name}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          )}

          {/* Weight dropdown - chỉ hiện khi item.weight có giá trị */}
          {hasValue(props?.item?.weight) && props?.productWeightData?.length > 0 && (
            <div className="relative">
              <span
                className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] py-1 px-2 rounded-md cursor-pointer"
                onClick={handleClickWeight}
              >
                Weight: {selectedWeight} <GoTriangleDown />
              </span>
              <Menu
                id="weight-menu"
                anchorEl={weightAnchorEl}
                open={openWeight}
                onClose={() => handleCloseWeight(null)}
              >
                {props.productWeightData.map((item, index) => (
                  <MenuItem
                    key={index}
                    className={`${item?.name === selectedWeight && 'selected'}`}
                    onClick={() => {
                      handleCloseWeight(item?.name);
                      updateCart('weight', item?.name, props?.item?.quantity);
                    }}
                  >
                    {item?.name}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          )}

          {/* Qty dropdown */}
          <div className="relative">
            <span
              className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] py-1 px-2 rounded-md cursor-pointer"
              onClick={handleClickQty}
            >
              Qty: {selectedQty} <GoTriangleDown />
            </span>
            <Menu
              id="qty-menu"
              anchorEl={qtyAnchorEl}
              open={openQty}
              onClose={() => handleCloseQty(null)}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button',
                },
              }}
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <MenuItem key={index} onClick={() => handleCloseQty(index + 1)}>
                  {index + 1}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>

        {/* Giá */}
        <div className="flex items-center gap-4 mt-2">
          <span className="oldPrice line-through text-gray-500 text-[14px] font-[500]">
            &#8363; {props?.item?.oldPrice?.toLocaleString('vi-VN')}
          </span>
          <span className="price text-primary text-[14px] font-[600]">
            &#8363; {props?.item?.price?.toLocaleString('vi-VN')}
          </span>
          <span className="text-primary text-[14px] font-[600]">{props?.item?.discount}% OFF</span>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
