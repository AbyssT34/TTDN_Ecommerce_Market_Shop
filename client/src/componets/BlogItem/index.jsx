import React from 'react';
import { IoMdTime } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { MdArrowForwardIos } from 'react-icons/md';

const BlogItem = (props) => {
  return (
    <>
      <div className="BlogItem group">
        <div className="imgWrapper w-full overflow-hidden rounded-md cursor-pointer relative">
          <img
            src={props?.item?.images[0]}
            alt="blog"
            className="w-full transition-all 
            group-hover:scale-105 group-hover:rotate-1"
          />

          <span
            className="flex items-center justify-between text-white absolute bottom-[15px] 
            right-[15px] z-50 bg-[#ff5252] rounded-md p-1 text-[12px] font-[500] gap-3"
          >
            <IoMdTime className="text-[18px]" />{
              props?.item?.createdAt?.split("T")[0]
            }
          </span>
        </div>

        <div className="info py-4">
          <h2 className="text-[15px] font-[600] text-black">
            <Link to={'/'} className="link">
              {props?.item?.title}
            </Link>
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html: props?.item?.description?.substr(0, 100) + '...',
            }}
            style={{
              maxWidth: '300px',
              wordBreak: 'break-word',
              whiteSpace: 'normal',
            }}
          ></div>
          <Link className="link font-[500] text-[14px] flex items-center gap-1">
            Read More <MdArrowForwardIos />
          </Link>
        </div>
      </div>
    </>
  );
};

export default BlogItem;
