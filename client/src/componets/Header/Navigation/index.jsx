import { Button } from '@mui/material';
import React, { useState } from 'react';
import { RiMenu2Fill } from 'react-icons/ri';
import { LiaAngleDownSolid } from 'react-icons/lia';
import { Link, Links } from 'react-router-dom';
import { GoRocket } from 'react-icons/go';
import CategoryPanel from './CategoryPanel';

import '../Navigation/style.css';

export const Navigation = () => {
  const [isopenCategoryPanel, setIsopenCategoryPanel] = useState(false);

  const openCategoryPanel = () => {
    setIsopenCategoryPanel(true);
  };
  return (
    <>
      <nav>
        <div className="container flex items-center justify-between gap-5">
          <div className="col_1 w-[20%]">
            <Button className="!text-black gap-2 w-full " onClick={openCategoryPanel}>
              <RiMenu2Fill size={18} />
              SHOP BY CATEGORYTAB
              <LiaAngleDownSolid size={13} className="ml-auto font-bold " />
            </Button>
          </div>
          <div className="col_2 w-[60%]">
            <ul className="flex items-center gap-3 nav">
              <li className="list-none">
                <Link to={'/'} className="link transform text-[14px] font-[500]">
                  <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4">
                    Home
                  </Button>
                </Link>
              </li>
              <li className="list-none relative">
                <Link to={'/ProductListing'} className="link transform text-[14px] font-[500]">
                  <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4">
                    Fashion
                  </Button>
                </Link>

                <div className="submenu absolute top-[120%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
                  <ul>
                    <li className="list-none w-full relative">
                      <Link to={'/'} className="w-full">
                        <Button className="text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none">
                          Men
                        </Button>

                        <div className="submenu absolute top-[0%] left-[100%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
                          <ul>
                            <li className="list-none">
                              <Link to={'/'} className="w-full">
                                <Button className="text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none">
                                  T-Shirt
                                </Button>
                              </Link>
                            </li>
                            <li className="list-none">
                              <Link to={'/'} className="w-full">
                                <Button className="text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none">
                                  Jeans
                                </Button>
                              </Link>
                            </li>
                            <li className="list-none">
                              <Link to={'/'} className="w-full">
                                <Button className="text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none">
                                  Footwear
                                </Button>
                              </Link>
                            </li>
                            <li className="list-none">
                              <Link to={'/'} className="w-full">
                                <Button className="text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none">
                                  Watch
                                </Button>
                              </Link>
                            </li>
                            <li className="list-none">
                              <Link to={'/'} className="w-full">
                                <Button className="text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none">
                                  Pents
                                </Button>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </Link>
                    </li>
                    <li className="list-none">
                      <Link to={'/'} className="w-full">
                        <Button className="text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none">
                          Women
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none">
                      <Link to={'/'} className="w-full">
                        <Button className="text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none">
                          Kids
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none">
                      <Link to={'/'} className="w-full">
                        <Button className="text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none">
                          Girls
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none">
                      <Link to={'/'} className="w-full">
                        <Button className="text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none">
                          Boys
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="list-none">
                <Link to={'/'} className="link transform text-[14px] font-[500]">
                  <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4">
                    Elctronics
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link to={'/'} className="link transform text-[14px] font-[500]">
                  <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4">
                    Bags
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link to={'/'} className="link transform text-[14px] font-[500]">
                  <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4">
                    Footwear
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link to={'/'} className="link transform text-[14px] font-[500]">
                  <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4">
                    Groceries
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link to={'/'} className="link transform text-[14px] font-[500]">
                  <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4">
                    Beauty
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link to={'/'} className="link transform text-[14px] font-[500]">
                  <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4">
                    Wellness
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link to={'/'} className="link transform text-[14px] font-[500]">
                  <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4">
                    Jewellery
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
          <div className="col_3 w-[20%]">
            <span className="text-[14px] !font-[500] flex items-center gap-3 ml-0 mt-0">
              {' '}
              <GoRocket size={18} /> Free International Delivery
            </span>
          </div>
        </div>
      </nav>

      {/*Category Panel components */}
      <CategoryPanel
        isopenCategoryPanel={isopenCategoryPanel}
        setIsopenCategoryPanel={setIsopenCategoryPanel}
      />
    </>
  );
};

export default Navigation;
