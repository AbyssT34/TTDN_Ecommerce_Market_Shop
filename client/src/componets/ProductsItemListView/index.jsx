import React, { useContext } from 'react';
import '../ProductsItem/style.css';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { MyContext } from '../../App';

const ProductsItemListView = (props) => {
  const context = useContext(MyContext);

  return (
    <div className="productsItem shadow-sm rounded-xl overflow-hidden border border-[rgba(0,0,0,0.08)] bg-white flex items-center gap-0 w-full">
      {/* ✅ Ảnh bên trái - cố định width */}
      <div className="group imgWrapper w-[280px] min-w-[280px] h-[230px] overflow-hidden relative rounded-l-xl">
        <Link to={`/product/${props.item?._id}`}>
          <img
            src={props.item?.images?.[0]}
            alt={props.item?.name}
            className="w-full h-full object-cover transition-all duration-700"
          />
          <img
            src={props.item?.images?.[1] || props.item?.images?.[0]}
            alt={props.item?.name}
            className="w-full h-full object-cover transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-105"
          />
        </Link>

        {/* Discount badge */}
        {props.item?.discount > 0 && (
          <span className="absolute top-[10px] left-[10px] z-50 bg-primary text-white rounded-lg px-2 py-1 text-[12px] font-[600]">
            {props.item?.discount}%
          </span>
        )}
      </div>

      {/* ✅ Info bên phải */}
      <div className="info flex-1 p-6 py-8">
        {/* Brand */}
        <h6 className="text-[13px] font-[400] text-gray-500 mb-1">
          <Link to={`/product/${props.item?._id}`} className="link transition-all">
            {props.item?.brand}
          </Link>
        </h6>

        {/* Tên sản phẩm */}
        <h3 className="text-[20px] font-[600] mb-3 text-[#000] leading-snug">
          <Link to={`/product/${props.item?._id}`} className="link transition-all">
            {props.item?.name}
          </Link>
        </h3>

        {/* Mô tả */}
        <p className="text-[14px] text-gray-500 mb-3 line-clamp-3 leading-relaxed">
          {props.item?.description}
        </p>

        {/* Rating */}
        <Rating
          name={`rating-${props.item?._id}`}
          value={props.item?.rating || 0}
          size="small"
          readOnly
        />

        {/* Giá */}
        <div className="flex items-center gap-4 mt-2 mb-4">
          {props.item?.oldPrice > 0 && (
            <span className="oldPrice line-through text-gray-400 text-[15px] font-[500]">
              đ {props.item?.oldPrice?.toLocaleString()}
            </span>
          )}
          <span className="price text-primary text-[16px] font-[700]">
            đ {props.item?.price?.toLocaleString()}
          </span>
        </div>

        {/* Add to Cart */}
        <Button className="bg-org !text-white !text-[13px] !capitalize !px-5 !py-2 !rounded-md flex gap-2">
          <MdOutlineShoppingCart className="text-[18px]" /> Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductsItemListView;
