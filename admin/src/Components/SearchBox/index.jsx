import React from "react";
import { useRef } from "react";
import { IoSearch } from "react-icons/io5";

const SearchBox = (props) => {
  const searchInput = useRef();

  const onChangeInput = (e) => {
    const value = e.target.value;

    // ✅ Dùng props thay vì state nội bộ
    if (props.setSearchQuery) {
      props.setSearchQuery(value);
    }

    if (value === "" && props.setPageOrder) {
      props.setPageOrder(0);
    }
  };

  return (
    <div className="w-full h-[40px] bg-[#f1f1f1] relative overflow-hidden">
      <IoSearch className="absolute top-[13px] left-[10px] z-50 pointer-events-none opacity-80" />
      <input
        type="text"
        className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] bg-[#f1f1f1] p-2 pl-8 focus:outline-none
         focus:border-[rgba(0,0,0,0.5)] rounded-md text-[13px]"
        placeholder="Search here..."
        value={props.searchQuery ?? ""} // ✅ dùng props.searchQuery
        ref={searchInput}
        onChange={onChangeInput}
      />
    </div>
  );
};

export default SearchBox;
