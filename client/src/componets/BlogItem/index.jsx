import React from 'react';
import { IoMdTime } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { MdArrowForwardIos } from 'react-icons/md';

const BlogItem = () => {
  return (
    <>
      <div className="BlogItem group">
        <div className="imgWrapper w-full overflow-hidden rounded-md cursor-pointer relative">
          <img
            src="/blog/blog1.png"
            alt="blog"
            className="w-full transition-all 
            group-hover:scale-105 group-hover:rotate-1"
          />

          <span
            className="flex items-center justify-between text-white absolute bottom-[15px] 
            right-[15px] z-50 bg-[#ff5252] rounded-md p-1 text-[12px] font-[500] gap-3"
          >
            <IoMdTime className="text-[18px]" />8 APARIL, 2025{' '}
          </span>
        </div>

        <div className="info py-4">
          <h2 className="text-[15px] font-[600] text-black">
            <Link className="link">Nullam ullamcorper ornare molestie</Link>
          </h2>
          <p className="text-[13px] font-[400] text-[rgba(0,0,0,0.8)] mb-4">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s
          </p>
          <Link className="link font-[500] text-[14px] flex items-center gap-1">
            Read More <MdArrowForwardIos />
          </Link>
        </div>
      </div>
    </>
  );
};

export default BlogItem;
