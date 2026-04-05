import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { FaPlus } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import Badge from "../../Components/Badge";
import SearchBox from "../../Components/SearchBox";
import { editData, fetchDataFromApi } from "../../utils/api";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useContext } from "react";
import { MyContext } from "../../App";
import TablePagination from "@mui/material/TablePagination";
import Pagination from "@mui/material/Pagination";

const Orders = () => {
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [pageOrder, setPageOrder] = useState(1); // ✅ base-1 cho Pagination
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [ordersData, setOrdersData] = useState([]);
  const [totalOrdersData, setTotalOrdersData] = useState([]);

  const context = useContext(MyContext);

  const handleChange = (event, id) => {
    setOrderStatus(event.target.value);

    const obj = {
      id: id,
      order_status: event.target.value,
    };

    editData(`/api/order/order-status/${id}`, obj).then((res) => {
      if (res?.data?.error === false) {
        context.alertBox("success", res?.data?.message);
      }
    });
  };

  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };

  useEffect(() => {
    fetchDataFromApi(`/api/order/order-list`).then((res) => {
      console.log(res);
      if (res?.error === false) {
        setOrders(res?.data);
      }
    });
  }, [orderStatus]);

  useEffect(() => {
    fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=6}`).then(
      (res) => {
        if (res?.error === false) {
          setOrders(res);
          setOrdersData(res?.data);
        }
      },
    );

    fetchDataFromApi(`/api/order/order-list`).then((res) => {
      if (res?.error === false) {
        setTotalOrdersData(res);
      }
    });
  }, [pageOrder]);

  useEffect(() => {
    if (searchQuery !== "") {
      const filteredOrders = totalOrdersData?.data?.filter(
        (order) =>
          order?._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order?.userId?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order?.userId?.email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order?.createdAt.includes(searchQuery),
      );
      setOrdersData(filteredOrders);
    } else {
      fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=6`).then(
        (res) => {
          if (res?.error === false) {
            setOrders(res);
            setOrdersData(res?.data);
          }
        },
      );
    }
  }, [searchQuery]);

  return (
    <>
      <div className="card my-4 shadow-md sm:rounded-lg bg-white">
        <div className="flex items-center justify-between px-5 py-5">
          <h2 className="text-[18px] font-[700]">Recent Orders</h2>
          <div className="w-[25%]">
            <SearchBox
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setPageOrder={setPageOrder}
            />
          </div>
        </div>
        <div className="relative overflow-x-auto mt-5">
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
              {ordersData?.length !== 0 &&
                ordersData?.map((orders, index) => {
                  return (
                    <>
                      <tr className="bg-white border-b  border-gray-200">
                        <td className="px-6 py-4 font-[500]">
                          <Button
                            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]"
                            onClick={() => isShowOrderdProduct(index)}
                          >
                            {isOpenOrderdProduct === index ? (
                              <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                            ) : (
                              <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                            )}
                          </Button>
                        </td>
                        <td className="px-6 py-4 font-[500]">
                          <span className="text-primary"> {orders?._id} </span>
                        </td>
                        <td className="px-6 py-4 font-[500]">
                          <span className="text-primary">
                            {orders?.paymentId
                              ? orders?.paymentId
                              : "CASH ON DELIVERY"}{" "}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-[500] whitespace-nowrap">
                          {orders?.userId?.name}
                        </td>
                        <td className="px-6 py-4 font-[500]">
                          {" "}
                          {orders?.userId?.mobile}
                        </td>
                        <td className="px-6 py-4 font-[500]">
                          <span className="block w-[300px]">
                            {orders?.delivery_address
                              ? [
                                  orders.delivery_address?.address_line1,
                                  orders.delivery_address?.city,
                                  orders.delivery_address?.lamdmark, // ✅ sửa 'lamdmark' → 'landmark'
                                  orders.delivery_address?.state,
                                  orders.delivery_address?.country,
                                  orders.delivery_address?.mobile
                                    ? `+${orders.delivery_address.mobile}`
                                    : null,
                                ]
                                  .filter(Boolean) // ✅ Lọc bỏ undefined/null
                                  .join(", ")
                              : "No address"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-[500]">
                          {orders?.delivery_address?.pincode}
                        </td>
                        <td className="px-6 py-4 font-[500]">
                          {orders?.totalAmt}
                        </td>
                        <td className="px-6 py-4 font-[500]">
                          {orders?.userId?.email}
                        </td>
                        <td className="px-6 py-4 font-[500]">
                          {" "}
                          <span className="text-primary">
                            {" "}
                            {orders?.userId?._id}{" "}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-[500]">
                          <Badge status={orders?.order_status} />
                        </td>
                        <td className="px-6 py-4 font-[500] whitespace-nowrap">
                          {orders?.createdAt?.split("T")[0]}
                        </td>
                      </tr>

                      {isOpenOrderdProduct === index && (
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
                                  {orders?.products?.map((item, index) => {
                                    return (
                                      <tr className="bg-white border-b  border-gray-200">
                                        <td className="px-6 py-4 font-[500]">
                                          <span className="text-gray-600">
                                            {item?._id}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 font-[500]">
                                          <div className="w-[200px]">
                                            <span>{item?.productTitle} </span>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 font-[500]">
                                          <img
                                            src={item?.image}
                                            className="w-[40px] h-[40px] object-cover rounded-md"
                                          />
                                        </td>
                                        <td className="px-6 py-4 font-[500] whitespace-nowrap">
                                          {item?.quantity}
                                        </td>
                                        <td className="px-6 py-4 font-[500]">
                                          {item?.price?.toLocaleString(
                                            "vi-VN",
                                            {
                                              // Nên dùng 'vi-VN' để hiển thị định dạng số kiểu Việt Nam
                                              style: "currency",
                                              currency: "VND",
                                              minimumFractionDigits: 0, // Loại bỏ phần .00 nếu không cần thiết
                                            },
                                          )}
                                        </td>
                                        <td className="px-6 py-4 font-[500]">
                                          {(
                                            item?.price * item?.quantity
                                          )?.toLocaleString("vi-VN", {
                                            // Nên dùng 'vi-VN' để hiển thị định dạng số kiểu Việt Nam
                                            style: "currency",
                                            currency: "VND",
                                            minimumFractionDigits: 0, // Loại bỏ phần .00 nếu không cần thiết
                                          })}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
            </tbody>
          </table>
        </div>
        {orders?.totalPages > 0 && (
          <div className="flex items-center justify-center mt-5 pb-5">
            <Pagination
              showFirstButton
              showLastButton
              count={orders?.totalPages || 0}
              page={pageOrder}
              onChange={(e, value) => setPageOrder(value)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
