import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { RiMenu2Fill } from 'react-icons/ri';
import { LiaAngleDownSolid } from 'react-icons/lia';
import { Link, useNavigate } from 'react-router-dom';
import { GoRocket } from 'react-icons/go';
import CategoryPanel from './CategoryPanel';
import '../Navigation/style.css';
import { useContext } from 'react';
import { MyContext } from '../../../App';

export const Navigation = () => {
  const [isopenCategoryPanel, setIsopenCategoryPanel] = useState(false);
  const [catData, setCatData] = useState([]);
  const context = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    setCatData(context?.catData);
  }, [context?.catData]);

  const openCategoryPanel = () => {
    setIsopenCategoryPanel(true);
  };

  // ✅ Navigate với đầy đủ params để SideBar tự check checkbox
  const handleCatClick = (cat) => {
    navigate(`/ProductListing?catId=${cat._id}&cat=${cat.name}`);
  };

  const handleSubCatClick = (subCat) => {
    navigate(`/ProductListing?subCatId=${subCat._id}&subCat=${subCat.name}`);
  };

  const handleThirdCatClick = (thirdCat) => {
    navigate(`/ProductListing?thirdsubCatId=${thirdCat._id}&thirdsubCat=${thirdCat.name}`);
  };

  return (
    <>
      <nav>
        <div className="container flex items-center justify-between gap-5">
          <div className="col_1 w-[20%]">
            <Button className="text-black! gap-2 w-full" onClick={openCategoryPanel}>
              <RiMenu2Fill size={18} />
              SHOP BY CATEGORYTAB
              <LiaAngleDownSolid size={13} className="ml-auto font-bold" />
            </Button>
          </div>

          <div className="col_2 w-[60%]">
            <ul className="flex items-center gap-3 nav">
              <li className="list-none">
                <Link to={'/'} className="link transform text-[14px] font-medium">
                  <Button className="link transition font-medium text-[rgba(0,0,0,0.8)]! hover:text-[#ff5252]! py-4!">
                    Home
                  </Button>
                </Link>
              </li>

              {catData?.length !== 0 &&
                catData?.map((cat, index) => (
                  <li className="list-none relative" key={index}>
                    {/* ✅ Category chính - truyền catId và tên */}
                    <Button
                      className="link transition font-medium text-[rgba(0,0,0,0.8)]! hover:text-[#ff5252]! py-4!"
                      onClick={() => handleCatClick(cat)}
                    >
                      {cat?.name}
                    </Button>

                    {/* Submenu cấp 2 */}
                    {cat?.children?.length !== 0 && (
                      <div className="submenu absolute top-[120%] left-[0%] min-w-37.5 bg-white shadow-md opacity-0 transition-all z-50">
                        <ul>
                          {cat?.children?.map((subCat, index_) => (
                            <li className="list-none w-full relative" key={index_}>
                              {/* ✅ SubCategory - truyền subCatId */}
                              <Button
                                className="text-[rgba(0,0,0,0.8)] w-full text-left! justify-start! rounded-none!"
                                onClick={() => handleSubCatClick(subCat)}
                              >
                                {subCat?.name}
                              </Button>

                              {/* Submenu cấp 3 */}
                              {subCat?.children?.length !== 0 && (
                                <div className="submenu absolute top-[0%] left-full min-w-37.5 bg-white shadow-md opacity-0 transition-all z-50">
                                  <ul>
                                    {subCat?.children?.map((thirdCat, index__) => (
                                      <li className="list-none w-full" key={index__}>
                                        {/* ✅ ThirdCategory - truyền thirdsubCatId */}
                                        <Button
                                          className="text-[rgba(0,0,0,0.8)] w-full text-left! justify-start! rounded-none!"
                                          onClick={() => handleThirdCatClick(thirdCat)}
                                        >
                                          {thirdCat?.name}
                                        </Button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </div>

          <div className="col_3 w-[20%]">
            <span className="text-[14px] font-medium! flex items-center gap-3 ml-0 mt-0">
              <GoRocket size={18} /> Free International Delivery
            </span>
          </div>
        </div>
      </nav>

      {catData?.length !== 0 && (
        <CategoryPanel
          isopenCategoryPanel={isopenCategoryPanel}
          setIsopenCategoryPanel={setIsopenCategoryPanel}
          data={catData}
        />
      )}
    </>
  );
};

export default Navigation;
