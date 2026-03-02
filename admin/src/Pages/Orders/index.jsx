import React, { useState } from "react";
import Button from "@mui/material/Button";
import { FaPlus } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import Badge from "../../Components/Badge";
import SearchBox from "../../Components/SearchBox";

const Orders = () => {
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);

  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };
  return (
    <>
      <div className="card my-4 shadow-md sm:rounded-lg bg-white">
        <div className="flex items-center justify-between px-5 py-5">
          <h2 className="text-[18px] font-[700]">Recent Orders</h2>
          <div className="w-[40%]">
            <SearchBox />
          </div>
        </div>
        <div className="relative overflow-x-auto mt-5 pb-5">
          <table className=" w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  &nbsp;
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Order Id
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Paymant Id
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Pincode
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Total Amount
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  User Id
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Order Status
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b  border-gray-200">
                <td className="px-6 py-4 font-[500]">
                  <Button
                    className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]"
                    onClick={() => isShowOrderdProduct(0)}
                  >
                    {isOpenOrderdProduct === 0 ? (
                      <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                    ) : (
                      <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                    )}
                  </Button>
                </td>
                <td className="px-6 py-4 font-[500]">
                  <span className="text-primary font-[600]">
                    6484651321861864186{" "}
                  </span>
                </td>
                <td className="px-6 py-4 font-[500]">
                  <span className="text-primary font-[600]">
                    pay_JHDHSDVHNSDVJH{" "}
                  </span>
                </td>
                <td className="px-6 py-4 font-[500] whitespace-nowrap">
                  Vịnh Trần
                </td>
                <td className="px-6 py-4 font-[500]">0946565316</td>
                <td className="px-6 py-4 font-[500]">
                  <span className="block w-[300px]">
                    TP Hồ Chí Minh Quận Gò Vấp
                  </span>
                </td>
                <td className="px-6 py-4 font-[500]">110053</td>
                <td className="px-6 py-4 font-[500]">3800</td>
                <td className="px-6 py-4 font-[500]">
                  quocvinhtran.0212@gmail.com
                </td>
                <td className="px-6 py-4 font-[500]">
                  {" "}
                  <span className="text-primary font-[600]">
                    648accsa651321861864e186{" "}
                  </span>
                </td>
                <td className="px-6 py-4 font-[500]">
                  <Badge status="pending" />
                </td>
                <td className="px-6 py-4 font-[500] whitespace-nowrap">
                  2025-8-31
                </td>
              </tr>

              {isOpenOrderdProduct === 0 && (
                <tr>
                  <td className=" pl-20" colSpan="6">
                    <div className="relative overflow-x-auto">
                      <table className=" w-full text-sm text-left rtl:text-right text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 whitespace-nowrap"
                            >
                              Product Id
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 whitespace-nowrap"
                            >
                              Product Title
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 whitespace-nowrap"
                            >
                              Imge
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 whitespace-nowrap"
                            >
                              Quantity
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 whitespace-nowrap"
                            >
                              Price
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 whitespace-nowrap"
                            >
                              Sub Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white border-b  border-gray-200">
                            <td className="px-6 py-4 font-[500]">
                              <span className="text-gray-600">
                                6484651321861864186{" "}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-[500]">
                              <span>Women Wide Leg High-Rise Light </span>
                            </td>
                            <td className="px-6 py-4 font-[500]">
                              <img
                                src="product1.jpg"
                                className="w-[40px] h-[40px] object-cover rounded-md"
                              />
                            </td>
                            <td className="px-6 py-4 font-[500] whitespace-nowrap">
                              2
                            </td>
                            <td className="px-6 py-4 font-[500]">$58.00</td>
                            <td className="px-6 py-4 font-[500]">$58.00</td>
                          </tr>

                          <tr className="bg-white border-b  border-gray-200">
                            <td className="px-6 py-4 font-[500]">
                              <span className="text-gray-600">
                                6484651321861864186{" "}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-[500]">
                              <span>Women Wide Leg High-Rise Light </span>
                            </td>
                            <td className="px-6 py-4 font-[500]">
                              <img
                                src="product1.jpg"
                                className="w-[40px] h-[40px] object-cover rounded-md"
                              />
                            </td>
                            <td className="px-6 py-4 font-[500] whitespace-nowrap">
                              2
                            </td>
                            <td className="px-6 py-4 font-[500]">$58.00</td>
                            <td className="px-6 py-4 font-[500]">$58.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Orders;
