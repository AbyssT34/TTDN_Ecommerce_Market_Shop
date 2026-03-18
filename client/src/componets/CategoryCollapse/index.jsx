import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { IoCloseSharp } from 'react-icons/io5';
import { FaRegPlusSquare } from 'react-icons/fa';
import { FaRegMinusSquare } from 'react-icons/fa';

const CategoryCollapse = (props) => {
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const [innerSubmenuIndex, setInnerSubmenuIndex] = useState(null);

  const openSubmenu = (index) => {
    if (submenuIndex === index) {
      setSubmenuIndex(null);
    } else {
      setSubmenuIndex(index);
    }
  };

  const openInnerSubmenu = (index) => {
    if (innerSubmenuIndex === index) {
      setInnerSubmenuIndex(null);
    } else {
      setInnerSubmenuIndex(index);
    }
  };

  return (
    <>
      <div className="scroll">
        <ul className="w-full">
          {props?.data?.length !== 0 &&
            props?.data?.map((cat, index) => {
              return (
                // ✅ Fix 1: Thêm key prop
                <li key={index} className="list-none flex items-center relative flex-col">
                  <Link to={'/'} className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]">
                      {cat?.name}
                    </Button>
                  </Link>

                  {submenuIndex === index ? (
                    <FaRegMinusSquare
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                      onClick={() => openSubmenu(index)}
                    />
                  ) : (
                    <FaRegPlusSquare
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                      onClick={() => openSubmenu(index)}
                    />
                  )}

                  {submenuIndex === index && (
                    <ul className="submenu w-full pl-3">
                      {cat?.children?.length !== 0 &&
                        cat?.children?.map((subCat, index_) => {
                          return (
                            // ✅ Fix 1: Thêm key prop
                            <li key={index_} className="list-none relative">
                              <Link to={'/'} className="w-full">
                                <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]">
                                  {subCat?.name}
                                </Button>
                              </Link>

                              {/* ✅ Fix 2: Đổi === 0 thành === index_ để toggle đúng từng item */}
                              {innerSubmenuIndex === index_ ? (
                                <FaRegMinusSquare
                                  className="absolute top-[10px] right-[15px] cursor-pointer"
                                  onClick={() => openInnerSubmenu(index_)}
                                />
                              ) : (
                                <FaRegPlusSquare
                                  className="absolute top-[10px] right-[15px] cursor-pointer"
                                  onClick={() => openInnerSubmenu(index_)}
                                />
                              )}

                              {/* ✅ Fix 2: Đổi === 0 thành === index_ */}
                              {innerSubmenuIndex === index_ && (
                                <ul className="inner_submenu w-full pl-3">
                                  {subCat?.children?.length !== 0 &&
                                    subCat?.children?.map((thirdLevelCat, index__) => {
                                      return (
                                        <li key={index__} className="list-none relative">
                                          <Link
                                            to={'/'}
                                            className="link w-full !text-left !justify-start !px-3 transition text-[14px] mb-1"
                                          >
                                            {thirdLevelCat?.name}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default CategoryCollapse;
