import { Button } from '@mui/material';
import React, { useContext, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);
  const history = useNavigate();

  const onChangeInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const search = () => {
    setIsLoading(true);

    const obj = {
      page: 1,
      limit: 30,
      query: searchQuery,
    };

    if (searchQuery !== '') {
      postData(`/api/product/search/get`, obj).then((res) => {
        context?.setSearchData(res);
      setTimeout(() => {
          setIsLoading(false);
          history('/search');
      },1000)
      });
    }
  };

  return (
    <div className="header-search w-[500px] bg-gray-100 rounded-md shadow relative">
      <input
        type="text"
        className="w-full h-[45px] bg-transparent outline-none px-4"
        placeholder="Search here..."
        value={searchQuery}
        onChange={onChangeInput}
      />
      <Button
        variant="text"
        className="!min-w-[35px] !w-[35px] !h-[35px]
         !rounded-full !absolute top-[7px] right-[10px] z-50"
        onClick={search}
      >
        {isLoading === true ? (
          <CircularProgress color="inherit" />
        ) : (
          <IoIosSearch size={20} className="text-gray-700" />
        )}
      </Button> 
    </div>
  );
};

export default Search;
