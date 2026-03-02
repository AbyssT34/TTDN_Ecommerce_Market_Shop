import React, { useState } from 'react';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { IoIosGitCompare } from 'react-icons/io';
import Button from '@mui/material/Button';
import QtyBox from '../../componets/QtyBox';
import Rating from '@mui/material/Rating';

const ProductDetailsComponent = () => {
  const [productActionsIndex, setProductActionsIndex] = useState(null);

  return (
    <>
      <div>
        <h1 className="text-[24px] font-[600] mb-2">
          Women Wide Leg High-Rise Light Fade Stretchable Jeans
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-[13px]">
            Brands :<span className="text-black font-[500] opacity-75">Flying Machine</span>
          </span>
          <Rating name="size-small" defaultValue={4} size="small" readOnly />
          <span className="text-[13px] cursor-pointer text-gray-500">Review (0)</span>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <span className="oldPrice line-through text-gray-500 text-[18px] font-[500]">$58.00</span>
          <span className="price text-primary text-[18px] font-[600]">$49.00</span>
          <span className="text-[14px]">
            Available In Stock:
            <span className="text-green-600 font-bold"> 147 Items</span>
          </span>
        </div>

        <br />
        <p className="mt-3 pr-10 mb-5">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book.
        </p>

        <div className="flex items-center gap-5">
          <span className="text-[16px]">Size:</span>
          <div className="flex items-center gap-1 actions">
            <Button
              className={`${productActionsIndex === 0 ? '!bg-[#ff5252] !text-white' : ''}`}
              onClick={() => setProductActionsIndex(0)}
            >
              S
            </Button>
            <Button
              className={`${productActionsIndex === 1 ? '!bg-[#ff5252] !text-white' : ''}`}
              onClick={() => setProductActionsIndex(1)}
            >
              M
            </Button>
            <Button
              className={`${productActionsIndex === 2 ? '!bg-[#ff5252] !text-white' : ''}`}
              onClick={() => setProductActionsIndex(2)}
            >
              L
            </Button>
            <Button
              className={`${productActionsIndex === 3 ? '!bg-[#ff5252] !text-white' : ''}`}
              onClick={() => setProductActionsIndex(3)}
            >
              XL
            </Button>
          </div>
        </div>
        <p className="text-[14px] mb-2 mt-5 !text-[#000]">
          Free Shipping (Est. Delivery Time 2-3 Days)
        </p>
        <div className="flex items-center  gap-4 py-4">
          <div className="qtyBoxWrapper w-[70px]">
            <QtyBox />
          </div>
          <Button className="bg-org flex gap-2">
            <MdOutlineShoppingCart className="text-[22px]" />
            Add To Cart
          </Button>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <span className="flex items-center gap-2 text-[15px] link cursor-pointer font-[500]">
            <FaRegHeart className="text-[18px]" />
            Add to Wishlist{' '}
          </span>
          <span className="flex items-center gap-2 text-[15px] link cursor-pointer font-[500]">
            <IoIosGitCompare className="text-[18px]" />
            Add to Compare
          </span>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsComponent;
