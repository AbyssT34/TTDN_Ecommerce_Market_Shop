import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import '../SideBar/style.css';
import { Collapse } from 'react-collapse';
import { FaAngleDown } from 'react-icons/fa6';
import Button from '@mui/material/Button';
import { FaAngleUp } from 'react-icons/fa6';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Rating from '@mui/material/Rating';
import { MyContext } from '../../App';
import { useLocation } from 'react-router-dom';
import { postData } from '../../utils/api';

const SideBar = (props) => {
  const [isopenCategoryFilter, setIsopenCategoryFilter] = useState(true);
  const [isopenAvilFilter, setIsopenAvilFilter] = useState(true);
  const [isopenSizeFilter, setIsopenSizeFilter] = useState(true);

  const [filters, setFilters] = useState({
    catId: [],
    subCatId: [],
    thirdsubCatId: [],
    minPrice: '', // ✅ giữ rỗng, chỉ set khi user kéo slider
    maxPrice: '', // ✅ giữ rỗng, chỉ set khi user kéo slider
    rating: [], // ✅ array thay vì string ''
    page: 1,
    limit: 5,
  });

  const [price, setPrice] = useState([0, 600000]);
  const isMounted = useRef(false); // ✅ tránh price useEffect chạy lần đầu

  const context = useContext(MyContext);
  const location = useLocation();

  // ✅ Xử lý checkbox check/uncheck
  const handleCheckboxChange = (field, value) => {
    const currentValues = filters[field] || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setFilters((prev) => ({
      ...prev,
      [field]: updatedValues,
      ...(field === 'catId' && { subCatId: [], thirdsubCatId: [] }),
    }));
  };

  // ✅ Đọc URL params và set filters tương ứng
  useEffect(() => {
    const url = window.location.href;
    const queryParameters = new URLSearchParams(location.search);

    if (url.includes('catId')) {
      const categoryId = queryParameters.get('catId');
      setFilters((prev) => ({
        ...prev,
        catId: [categoryId],
        subCatId: [],
        thirdsubCatId: [],
        rating: [],
        page: 1,
      }));
    } else if (url.includes('subCatId')) {
      const subCategoryId = queryParameters.get('subCatId');
      setFilters((prev) => ({
        ...prev,
        catId: [],
        subCatId: [subCategoryId],
        thirdsubCatId: [],
        rating: [],
        page: 1,
      }));
    } else if (url.includes('thirdsubCatId')) {
      const thirdsubCatId = queryParameters.get('thirdsubCatId');
      setFilters((prev) => ({
        ...prev,
        catId: [],
        subCatId: [],
        thirdsubCatId: [thirdsubCatId],
        rating: [],
        page: 1,
      }));
    } else {
      // Không có params - reset filters
      setFilters((prev) => ({
        ...prev,
        catId: [],
        subCatId: [],
        thirdsubCatId: [],
        rating: [],
        page: 1,
      }));
    }
  }, [location]);

  // ✅ Gọi API filter
  const filterData = useCallback(() => {
    props.setIsLoading(true);
    postData(`/api/product/filters`, { ...filters, page: props.page || filters.page }).then(
      (res) => {
        props.setProductsData(res);
        props.setIsLoading(false);
        props.setTotalPages(res?.totalPages);
        window.scrollTo(0, 0);
      }
    );
  }, [filters, props.page]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  // ✅ Chỉ set price filter khi user thực sự kéo slider (bỏ qua lần đầu mount)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    setFilters((prev) => ({
      ...prev,
      minPrice: price[0],
      maxPrice: price[1],
    }));
  }, [price]);

  return (
    <>
      <aside className="sidebar py-5 sticky top-[70px] z-[50]">
        {/* Shop By Category */}
        <div className="box">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Shop By Category
            <Button
              className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]"
              onClick={() => setIsopenCategoryFilter(!isopenCategoryFilter)}
            >
              {isopenCategoryFilter ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </h3>
          <Collapse isOpened={isopenCategoryFilter}>
            <div className="scroll px-4 relative -left-[13px]">
              {context?.catData?.length !== 0 &&
                context?.catData?.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item?._id}
                    control={<Checkbox size="small" />}
                    checked={filters?.catId?.includes(item?._id)}
                    label={item?.name}
                    onChange={() => handleCheckboxChange('catId', item?._id)}
                    className="w-full"
                  />
                ))}
            </div>
          </Collapse>
        </div>

        {/* Filter By Price */}
        <div className="box mt-4">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Filter By Price
          </h3>
          <RangeSlider value={price} onInput={setPrice} min={0} max={600000} />
          <div className="flex pt-4 pb-2 priceRange">
            <span className="text-[13px]">
              From: <strong className="text-dark">Rs: {price[0]}</strong>
            </span>
            <span className="ml-auto text-[13px]">
              To: <strong className="text-dark">Rs: {price[1]}</strong>
            </span>
          </div>
        </div>

        {/* Filter By Rating */}
        <div className="box mt-4">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Filter By Rating
          </h3>
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center">
              <FormControlLabel
                value={star}
                control={<Checkbox size="small" />}
                checked={filters?.rating?.includes(star)}
                onChange={() => handleCheckboxChange('rating', star)}
              />
              <Rating name={`rating-${star}`} value={star} size="small" readOnly />
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
