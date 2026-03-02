import React, { useState } from 'react';
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

const SideBar = () => {
  const [isopenCategoryFilter, setIsopenCategoryFilter] = useState(true);
  const [isopenAvilFilter, setIsopenAvilFilter] = useState(true);
  const [isopenSizeFilter, setIsopenSizeFilter] = useState(true);
  return (
    <>
      <aside className="sidebar">
        <div className="box">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Shop By Category
            <Button
              className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]"
              onClick={() => setIsopenCategoryFilter(!isopenCategoryFilter)}
            >
              {isopenCategoryFilter === true ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </h3>
          <Collapse isOpened={isopenCategoryFilter}>
            <div className="scroll px-4 relative -left-[13px]">
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="Fashion"
                className="w-full"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="Elctronics"
                className="w-full"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="Bags"
                className="w-full"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="Footwear"
                className="w-full"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="Groceries"
                className="w-full"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="Beauty"
                className="w-full"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="Wellness"
                className="w-full"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="Jewellery"
                className="w-full"
              />
            </div>
          </Collapse>
        </div>

        <div className="box">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Availability
            <Button
              className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]"
              onClick={() => setIsopenAvilFilter(!isopenAvilFilter)}
            >
              {isopenAvilFilter === true ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </h3>
          <Collapse isOpened={isopenAvilFilter}>
            <div className="scroll px-4 relative -left-[13px]">
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="Available (17)"
                className="w-full"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="In stock (10)"
                className="w-full"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="Not available (1)"
                className="w-full"
              />
            </div>
          </Collapse>
        </div>

        <div className="box mt-3">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Size
            <Button
              className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]"
              onClick={() => setIsopenSizeFilter(!isopenSizeFilter)}
            >
              {isopenSizeFilter === true ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </h3>
          <Collapse isOpened={isopenSizeFilter}>
            <div className="scroll px-4 relative -left-[13px]">
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="Samll (6)"
                className="w-full"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="Medium (5)"
                className="w-full"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="Large (4)"
                className="w-full"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="XL (1)"
                className="w-full"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label="XLL (3)"
                className="w-full"
              />
            </div>
          </Collapse>
        </div>

        <div className="box mt-4">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Filter By Price
          </h3>

          <RangeSlider />
          <div className="flex pt-4 pb-2 priceRange">
            <span className="text-[13px]">
              From: <strong className="text-dark">Rs: {100}</strong>
            </span>
            <span className="ml-auto text-[13px]">
              From: <strong className="text-dark">Rs: {5000}</strong>
            </span>
          </div>
        </div>

        <div className="box mt-4">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Filter By Rating
          </h3>
          <div className="w-full cursor-pointer">
            <Rating name="size-small" defaultValue={5} size="small" readOnly />
          </div>
          <div className="w-full">
            <Rating name="size-small" defaultValue={4} size="small" readOnly />
          </div>
          <div className="w-full">
            <Rating name="size-small" defaultValue={3} size="small" readOnly />
          </div>
          <div className="w-full">
            <Rating name="size-small" defaultValue={2} size="small" readOnly />
          </div>
          <div className="w-full">
            <Rating name="size-small" defaultValue={1} size="small" readOnly />
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
