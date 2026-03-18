import React, { useContext } from 'react';
import '../ProductsItem/style.css';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { FaRegHeart } from 'react-icons/fa';
import { IoIosGitCompare } from 'react-icons/io';
import { MdOutlineZoomOutMap } from 'react-icons/md';
import { MyContext } from '../../App';

const ProductsItem = (props) => {
  const context = useContext(MyContext);

  return (
    <>
      <div className="productsItem shadow-lg rounded-md overflow-hidden border-1 border-[rgba(0,0,0,0.1)]">
        <div className="group imgWrapper w-[100%]  overflow-hidden rounded-md relative">
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
        <div className="info p-3 py-5">
          <h6 className="text-[13px] title mt-1 font-[500] mb-1 text-[#000]">
            <span className="link transition-all">{props?.item?.brand}</span>
          </h6>

          <h3 className="text-[13px] !font-[400]">
            <Link to={`/product/${props?.item?._id}`} className="link transition-all">
              {props?.item?.name}
            </Link>
          </h3>
          <Rating name="size-small" defaultValue={props?.item?.rating} size="small" readOnly />

          <div className="flex items-center gap-4">
            <span className="oldPrice line-through text-gray-500 text-[15px] font-[500]">
              &#8363; {props?.item?.price}
            </span>
            <span className="price text-primary text-[15px] font-[600]">
              &#8363; {props?.item?.oldPrice}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsItem;
