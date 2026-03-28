import React, { useContext, useEffect, useState } from 'react';
import '../ProductsItem/style.css';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { FaRegHeart } from 'react-icons/fa';
import { IoIosGitCompare } from 'react-icons/io';
import { MdOutlineShoppingCart, MdOutlineZoomOutMap } from 'react-icons/md';
import { MyContext } from '../../App';
import { FaMinus } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa';
import CartItems from '../../Page/Cart/cartItems';
import { deleteData, editData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';

const ProductsItem = (props) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [cartItem, setCartItem] = useState([]);

  const [activeTab, setActiveTab] = useState(null);
  const [isShowTabs, setIsShowTabs] = useState(false);
  const [selectedTabName, setSelcetedTabName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);

  const addToCart = (product, userId, quantity) => {
    const producItem = {
      _id: product?._id,
      name: product?.name,
      image: product?.images[0],
      rating: product?.rating,
      price: product?.price,
      oldPrice: product?.oldPrice,
      discount: product?.discount,
      quantity: quantity,
      subTotal: parseInt(product?.price * quantity),
      countInStock: product?.countInStock,
      brand: product?.brand,
      size: props?.item?.size?.length !== 0 ? selectedTabName || '' : '', // ✅
      weight: props?.item?.productWeight?.length !== 0 ? selectedTabName || '' : '', // ✅ sửa producWeight → productWeight
      ram: props?.item?.productRam?.length !== 0 ? selectedTabName || '' : '',
    };

    setIsLoading(true);

    if (
      props?.item?.size?.length !== 0 ||
      props?.item?.productRam?.length !== 0 ||
      props?.item?.producWeight?.length !== 0
    ) {
      setIsShowTabs(true);
    } else {
      setIsAdded(true);
      setIsShowTabs(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      context?.addToCart(producItem, userId, quantity);
    }

    if (activeTab !== null) {
      if (!selectedTabName) {
        context.alertBox('error', 'Please select a size/option first');
        return;
      }
      context?.addToCart(producItem, userId, quantity);
      setIsAdded(true);
      setIsShowTabs(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const handleClickActivetab = (index, name) => {
    setActiveTab(index);
    setSelcetedTabName(name);
  };

  useEffect(() => {
    const item = context?.cartData?.filter((CartItem) =>
      CartItem.productId.includes(props?.item?._id)
    );

    if (item?.length !== 0) {
      setCartItem(item);
      setIsAdded(true);
      setQuantity(item[0]?.quantity);
    } else {
      setQuantity(1);
    }
  }, [context?.cartData]);

  const minusQyt = () => {
    if (quantity !== 1 && quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setQuantity(1);
    }

    if (quantity === 1) {
      deleteData(`/api/cart/delete-cart-item/${cartItem[0]?._id}`).then((res) => {
        setIsAdded(false);
        context.alertBox('success', 'Item Removed');
        context?.getCartItems();
        setIsShowTabs(false);
        setActiveTab(null);
      });
    } else {
      const obj = {
        _id: cartItem[0]?._id,
        qty: quantity - 1,
        subTotal: props?.item?.price * (quantity - 1),
      };

      editData(`/api/cart/update-qty`, obj).then((res) => {
        context.alertBox('success', res?.data?.message);
        context?.getCartItems();
      });
    }
  };

  const addQyt = () => {
    setQuantity(quantity + 1);

    const obj = {
      _id: cartItem[0]?._id,
      qty: quantity + 1,
      subTotal: props?.item?.price * (quantity + 1),
    };

    editData(`/api/cart/update-qty`, obj).then((res) => {
      context.alertBox('success', res?.data?.message);
      context?.getCartItems();
    });
  };

  return (
    <>
      <div className="productsItem shadow-lg rounded-md overflow-hidden border-1 border-[rgba(0,0,0,0.1)]">
        <div className="group imgWrapper w-[100%]  overflow-hidden rounded-md rounded-bl-none rounded-br-none relative">
          <Link to={`/product/${props?.item?._id}`}>
            <div className="img h-[220px] overflow-hidden">
              <img src={props?.item?.images[0]} className="w-full" />
              <img
                src={props?.item?.images[1]}
                alt="wrapper"
                className="w-full transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-150"
              />
            </div>
          </Link>

          {isShowTabs === true && (
            <div className="flex items-center justify-center absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] z-[60] p-3 gap-2 opacity-100">
              {props?.item?.size?.length !== 0 &&
                props?.item?.size?.map((size, index) => {
                  return (
                    <span
                      key={index}
                      className={`flex items-center justify-center p-1 px-2 bg-white/80  h-[25px] max-w-[35px] 
    rounded-sm cursor-pointer hover:bg-white transition-colors duration-200 text-[12px]
     ${activeTab === index && '!bg-[#ff5252] text-white'}`}
                      onClick={() => handleClickActivetab(index, size)}
                    >
                      {size}
                    </span>
                  );
                })}

              {props?.item?.productRam?.length !== 0 &&
                props?.item?.productRam?.map((item, index) => {
                  return (
                    <span
                      key={index}
                      className={`flex items-center justify-center p-1 px-2 bg-white/80  h-[25px] max-w-[45px] 
    rounded-sm cursor-pointer hover:bg-white transition-colors duration-200 text-[12px]
     ${activeTab === index && '!bg-[#ff5252] text-white'}`}
                      onClick={() => handleClickActivetab(index, item)}
                    >
                      {item}
                    </span>
                  );
                })}

              {props?.item?.productWeight?.length !== 0 &&
                props?.item?.productWeight?.map((item, index) => {
                  return (
                    <span
                      key={index}
                      className={`flex items-center justify-center p-1 px-2 bg-white/80  h-[25px] max-w-[35px] 
    rounded-sm cursor-pointer hover:bg-white transition-colors duration-200 text-[12px]
     ${activeTab === index && '!bg-[#ff5252] text-white'}`}
                      onClick={() => handleClickActivetab(index, item)}
                    >
                      {item}
                    </span>
                  );
                })}
            </div>
          )}

          <span
            className="discount flex items-center absolute top-[10px] left-[10px] z-50 
    bg-primary text-white rounded-lg p-1 text-[12px] font-[500]"
          >
            {props?.item?.discount}
          </span>

          <div
            className="actions absolute top-[-200px] right-[5px] z-50 flex 
    items-center gap-2 flex-col w-[50px] duration-300 group-hover:top-[15px] opacity-0 group-hover:opacity-100"
          >
            <Button
              className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white
         text-black hover:!bg-[#ff5252] hover:text-white group"
              onClick={() => context.handleOpenProductDetailsModal(true, props?.item)}
            >
              <MdOutlineZoomOutMap
                className="text-[18px]
          !text-black group-hover:text-white hover:!text-white"
              />
            </Button>
            <Button
              className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white
         text-black hover:!bg-[#ff5252] hover:text-white group"
            >
              <IoIosGitCompare
                className="text-[18px]
          !text-black group-hover:text-white hover:!text-white"
              />
            </Button>

            <Button
              className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white
         text-black hover:!bg-[#ff5252] hover:text-white group"
            >
              <FaRegHeart
                className="text-[18px]
          !text-black group-hover:text-white hover:!text-white"
              />
            </Button>
          </div>
        </div>

        <div className="info p-3 py-5 relative pb-[50px] h-[190px]">
          <h6 className="text-[13px] title mt-1 font-[500] mb-1 text-[#000]">
            <span className="link transition-all">{props?.item?.brand}</span>
          </h6>

          <h3 className="text-[13px] !font-[400]">
            <Link to={`/product/${props?.item?._id}`} className="link transition-all">
              {props?.item?.name?.substr(0, 40) + '...'}
            </Link>
          </h3>
          <Rating name="size-small" defaultValue={props?.item?.rating} size="small" readOnly />

          <div className="flex items-center gap-4">
            <span className="oldPrice line-through text-gray-500 text-[14px] font-[500]">
              &#8363; {props?.item?.oldPrice}
            </span>
            <span className="price text-primary text-[14px] font-[600]">
              &#8363; {props?.item?.price}
            </span>
          </div>
          <div className="!absolute bottom-[15px] left-0 pl-3 pr-3 w-full">
            {isAdded === false ? (
              <Button
                className="bg-org btn-border flex w-full btn-sm gap-2"
                size="small"
                onClick={() => addToCart(props?.item, context?.userData?._id, quantity)}
              >
                <MdOutlineShoppingCart className="text-[18px]" /> Add to Cart
              </Button>
            ) : (
              <>
                {isLoading === true ? (
                  <Button className="bg-org btn-border flex w-full btn-sm gap-2" size="small">
                    <CircularProgress />
                    <MdOutlineShoppingCart className="text-[18px]" /> Add to Cart
                  </Button>
                ) : (
                  <div className="flex items-center justify-between overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)]">
                    <Button
                      className="!min-w-[35px] !w-[35px] !h-[30px] !bg-[#f1f1f1]  !rounded-none"
                      onClick={minusQyt}
                    >
                      <FaMinus className="text-[rgba(0,0,0,0.7)]" />
                    </Button>
                    <span>{quantity}</span>
                    <Button
                      className="!min-w-[35px] !w-[35px] !h-[30px] !bg-[#ff5252] !rounded-none"
                      onClick={addQyt}
                    >
                      <FaPlus className="text-white" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsItem;
