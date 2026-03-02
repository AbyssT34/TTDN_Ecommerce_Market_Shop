import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { IoCloseSharp } from 'react-icons/io5';
import { FaRegPlusSquare } from 'react-icons/fa';
import { FaRegMinusSquare } from 'react-icons/fa';

const CategoryCollapse = () => {
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
      <div className="scroll ">
        <ul className="w-full">
          <li className="list-none flex items-center relative flex-col">
            <Link to={'/'} className="w-full">
              <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]">
                Fashion{' '}
              </Button>
            </Link>
            {submenuIndex === 0 ? (
              <FaRegMinusSquare
                className="absolute top-[10px] right-[15px] cursor-pointer"
                onClick={() => openSubmenu(0)}
              />
            ) : (
              <FaRegPlusSquare
                className="absolute top-[10px] right-[15px] cursor-pointer"
                onClick={() => openSubmenu(0)}
              />
            )}
            {submenuIndex === 0 && (
              <ul className="submenu w-full pl-3">
                <li className="list-none relative">
                  <Link to={'/'} className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]">
                      Apparel{' '}
                    </Button>
                  </Link>
                  {innerSubmenuIndex === 0 ? (
                    <FaRegMinusSquare
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                      onClick={() => openInnerSubmenu(0)}
                    />
                  ) : (
                    <FaRegPlusSquare
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                      onClick={() => openInnerSubmenu(0)}
                    />
                  )}
                  {innerSubmenuIndex === 0 && (
                    <ul className="inner_submenu  w-full pl-3">
                      <li className="list-none relative">
                        <Link
                          to={'/'}
                          className="link w-full !text-left !justify-start !px-3 transition text-[14px] mb-1"
                        >
                          Smart Tablet{' '}
                        </Link>
                      </li>
                      <li className="list-none relative">
                        <Link
                          to={'/'}
                          className="link w-full !text-left !justify-start !px-3 transition text-[14px] mb-1"
                        >
                          Crepe T-Shirt{' '}
                        </Link>
                      </li>{' '}
                      <li className="list-none relative">
                        <Link
                          to={'/'}
                          className="link w-full !text-left !justify-start !px-3 transition text-[14px] mb-1"
                        >
                          Leather Watch{' '}
                        </Link>
                      </li>{' '}
                      <li className="list-none relative">
                        <Link
                          to={'/'}
                          className="link w-full !text-left !justify-start !px-3 transition text-[14px] mb-1"
                        >
                          Rolling Diamond{' '}
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>

          <li className="list-none flex items-center relative flex-col">
            <Link to={'/'} className="w-full">
              <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]">
                Outerwear{' '}
              </Button>
            </Link>
            {submenuIndex === 1 ? (
              <FaRegMinusSquare
                className="absolute top-[10px] right-[15px] cursor-pointer"
                onClick={() => openSubmenu(1)}
              />
            ) : (
              <FaRegPlusSquare
                className="absolute top-[10px] right-[15px] cursor-pointer"
                onClick={() => openSubmenu(1)}
              />
            )}
            {submenuIndex === 1 && (
              <ul className="submenu w-full pl-3">
                <li className="list-none relative">
                  <Link to={'/'} className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]">
                      Apparel{' '}
                    </Button>
                  </Link>
                  {innerSubmenuIndex === 1 ? (
                    <FaRegMinusSquare
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                      onClick={() => openInnerSubmenu(1)}
                    />
                  ) : (
                    <FaRegPlusSquare
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                      onClick={() => openInnerSubmenu(1)}
                    />
                  )}
                  {innerSubmenuIndex === 1 && (
                    <ul className="inner_submenu  w-full pl-3">
                      <li className="list-none relative">
                        <Link
                          to={'/'}
                          className="link w-full !text-left !justify-start !px-3 transition text-[14px] mb-1"
                        >
                          Smart Tablet{' '}
                        </Link>
                      </li>
                      <li className="list-none relative">
                        <Link
                          to={'/'}
                          className="link w-full !text-left !justify-start !px-3 transition text-[14px] mb-1"
                        >
                          Crepe T-Shirt{' '}
                        </Link>
                      </li>{' '}
                      <li className="list-none relative">
                        <Link
                          to={'/'}
                          className="link w-full !text-left !justify-start !px-3 transition text-[14px] mb-1"
                        >
                          Leather Watch{' '}
                        </Link>
                      </li>{' '}
                      <li className="list-none relative">
                        <Link
                          to={'/'}
                          className="link w-full !text-left !justify-start !px-3 transition text-[14px] mb-1"
                        >
                          Rolling Diamond{' '}
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default CategoryCollapse;
