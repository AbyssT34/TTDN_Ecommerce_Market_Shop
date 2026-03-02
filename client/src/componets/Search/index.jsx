import { Button } from '@mui/material';
import React from 'react';
import { IoIosSearch } from 'react-icons/io';

const Search = () => {
  return (
    <div className="header-search w-[500px] bg-gray-100 rounded-md shadow relative">
      <input
        type="text"
        className="w-full h-[45px] bg-transparent outline-none px-4"
        placeholder="Search here..."
      />
      <Button
        variant="text"
        className="!min-w-[35px] !w-[35px] !h-[35px]
         !rounded-full !absolute top-[7px] right-[10px] z-50"
      >
        <IoIosSearch size={20} className="text-gray-700" />
      </Button>
    </div>
  );
};

export default Search;
