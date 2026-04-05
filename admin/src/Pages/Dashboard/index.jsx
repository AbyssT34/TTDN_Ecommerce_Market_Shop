import React, { useState, PureComponent, useContext, useEffect } from "react";
import DashboardBoxes from "../../Components/DashboardBoxes";
import Button from "@mui/material/Button";
import { FaPlus } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import Badge from "../../Components/Badge";
import { FaAngleUp } from "react-icons/fa6";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import ProgressBar from "../../Components/ProgressBar";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import Pagination from "@mui/material/Pagination";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import SearchBox from "../../Components/SearchBox";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import CircularProgress from "@mui/material/CircularProgress";
import Rating from "@mui/material/Rating";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
  { id: "product", label: "PRODUCT", minWidth: 150 },
  { id: "category", label: "CATEGORY", minWidth: 100 },
  {
    id: "subcategory",
    label: "SUB CATEGORY",
    minWidth: 150,
  },
  {
    id: "price",
    label: "PRICE",
    minWidth: 150,
  },
  {
    id: "sales",
    label: "SALES",
    minWidth: 150,
  },
  {
    id: "rating",
    label: "RATING",
    minWidth: 150,
  },
  {
    id: "action",
    label: "ACTION",
    minWidth: 150,
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const Dashboard = () => {
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);

  const [productCat, setProductCat] = useState("");
  const [productData, setProductData] = useState([]);
  const [productSubCat, setProductSubCat] = useState("");
  const [productThirLaveldCat, setProductThirLaveldCat] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [sortedIds, setSortedIds] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [totalOrdersData, setTotalOrdersData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersCount, setOrdersCount] = useState(null);

  const [users, setUsers] = useState([]);
  const [allReviews, setAllReviews] = useState([]);

  const [pageOrder, setPageOrder] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [chartData, setChartData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const context = useContext(MyContext);

  useEffect(() => {
    getProducts();
  }, [context?.refreshData]);
  // ✅ watch refreshData thay vì setIsOpenFullScreenPanel

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

    fetchDataFromApi(`/api/order/count`).then((res) => {
      if (res?.error === false) {
        setOrdersCount(res?.count);
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

  useEffect(() => {
    getTotalSalesByYear();

    fetchDataFromApi(`/api/user/getAllUsers`).then((res) => {
      if (res?.error === false) {
        setUsers(res?.users);
      }
    });

    fetchDataFromApi(`/api/user/getAllReviews`).then((res) => {
      if (res?.error === false) {
        setAllReviews(res?.reviews);
      }
    });
  }, []);

  //Handler to toggle all checkboxes
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;

    //update all items checked status
    const updateItems = productData.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setProductData(updateItems);

    //Update the sorted IDs state
    if (isChecked) {
      const ids = updateItems.map((item) => item._id).sort((a, b) => a - b);
      setSortedIds(ids);
    } else {
      setSortedIds([]);
    }
  };

  const handleCheckboxChange = (e, id, index) => {
    const updateItems = productData.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item,
    );

    setProductData(updateItems);

    //Update the sorted IDs state
    const selectedIds = updateItems
      .filter((item) => item.checked)
      .map((item) => item._id)
      .sort((a, b) => a - b);
    setSortedIds(selectedIds);
  };

  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getProducts = async () => {
    setIsLoading(true);
    fetchDataFromApi(`/api/product/getAllProducts`).then((res) => {
      let productArr = [];
      if (res?.error === false) {
        for (let i = 0; i < res?.products?.length; i++) {
          productArr[i] = res?.products[i];
          productArr[i].checked = false;
        }
        setTimeout(() => {
          setProductData(productArr);
          setIsLoading(false);
        }, 300);
      }
    });
  };

  const handleChangeProductCat = (event) => {
    const value = event.target.value;
    setProductCat(value);
    setProductSubCat("");
    setProductThirLaveldCat("");
    setIsLoading(true);
    // ✅ fix double slash
    fetchDataFromApi(`/api/product/getAllProductsByCatId/${value}`).then(
      (res) => {
        if (res?.error === false) {
          setProductData(res?.products);
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        }
      },
    );
  };

  const handleChangeProductSudCat = (event) => {
    const value = event.target.value;
    setProductCat("");
    setProductSubCat(value);
    setProductThirLaveldCat("");
    setIsLoading(true);
    fetchDataFromApi(`/api/product/getAllProductsBySubCatId/${value}`).then(
      (res) => {
        if (res?.error === false) {
          setProductData(res?.products);
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        }
      },
    );
  };

  // ✅ Third Level Category
  const handleChangeProductThirLavelCat = (event) => {
    const value = event.target.value;
    setProductThirLaveldCat(value);
    setProductCat("");
    setProductSubCat("");
    setIsLoading(true);
    fetchDataFromApi(
      `/api/product/getAllProductsByThirdLavelCat/${value}`,
    ).then((res) => {
      if (res?.error === false) {
        setProductData(res?.products);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    });
  };

  const deleteProduct = (id) => {
    deleteData(`/api/product/${id}`).then((res) => {
      getProducts();
      context.alertBox("success", "Product deleted");
    });
  };

  const getTotalUserByYear = () => {
    fetchDataFromApi(`/api/order/users`).then((res) => {
      const user = [];
      res?.monthlyUser?.length !== 0 && // ✅ đúng field
        res?.monthlyUser?.map((item) => {
          user.push({
            name: item?.name,
            TotalUsers: parseInt(item?.totalUsers), // ✅ đúng field
          });
        });
      const uniqueArr = user.filter(
        (obj, index, self) =>
          index === self.findIndex((t) => t.name === obj.name),
      );
      setChartData(uniqueArr); // ✅ đừng quên set data
    });
  };
  const getTotalSalesByYear = () => {
    fetchDataFromApi(`/api/order/sales`).then((res) => {
      const sales = [];
      res?.monthlySales?.length !== 0 &&
        res?.monthlySales?.map((item) => {
          sales.push({
            name: item?.name,
            TotalSales: parseInt(item?.totalSale), //
          });
        });
      const uniqueArr = sales.filter(
        (obj, index, self) =>
          index === self.findIndex((t) => t.name === obj.name),
      );
      setChartData(uniqueArr);
    });
  };
  const handleChangeYerar = (event) => {
    getTotalSalesByYear(event.target.value);
    setYear(event.target.value);
  };

  return (
    <>
      <div
        className="w-full py-2 p-5 bg-white border border-[rgba(0,0,0,0.1)] flex items-center gap-8 mb-5 
      justify-between rounded-md"
      >
        <div className="info">
          <h1 className="text-[35px] font-bold leading-10 mb-3">
            Good Morning,
            <br /> Cameron
          </h1>
          <p>
            Here's what happening on your store today. See the statistics at
            once.
          </p>
          <br />

          <Button
            className="btn-blue !capitalize"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add Product",
              })
            }
          >
            <FaPlus />
            Add Product
          </Button>
        </div>
        <img src="/logoadmin.jpeg" className="w-[400px]" />
      </div>
      {productData?.length !== 0 &&
        users?.length !== 0 &&
        allReviews?.length !== 0 && (
          <DashboardBoxes
            orders={ordersCount}
            products={productData?.length}
            users={users?.length}
            reivews={allReviews?.length}
            categorry={context?.catData?.length}
          />
        )}

      <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
        <div className="flex items-center w-full px-5 justify-between gap-4">
          <div className="col w-[15%]">
            <h3 className="font-[600] text-[13px] mb-2">Category By</h3>
            {context?.catData?.length !== 0 && (
              <Select
                style={{ zoom: "80%" }}
                size="small"
                className="w-full"
                value={productCat}
                onChange={handleChangeProductCat}
              >
                {context?.catData.map((cat, index) => (
                  <MenuItem value={cat?._id} key={index}>
                    {cat?.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </div>

          <div className="col w-[15%]">
            <h3 className="font-[600] text-[13px] mb-2">Sub Category By</h3>
            {context?.catData?.length !== 0 && (
              <Select
                style={{ zoom: "80%" }}
                size="small"
                className="w-full"
                value={productSubCat}
                onChange={handleChangeProductSudCat}
              >
                {context?.catData.map((cat) =>
                  cat?.children?.map((subCat, index) => (
                    <MenuItem value={subCat?._id} key={index}>
                      {subCat?.name}
                    </MenuItem>
                  )),
                )}
              </Select>
            )}
          </div>

          {/* Third Level */}
          <div className="col w-[20%]">
            <h3 className="text-[14px] font-[500] mb-1 text-black">
              Third Level Sub Category By
            </h3>
            {context?.catData?.length !== 0 && (
              <Select
                style={{ zoom: "80%" }}
                size="small"
                className="w-full"
                value={productThirLaveldCat}
                onChange={handleChangeProductThirLavelCat}
              >
                {context?.catData.map((cat) =>
                  cat?.children?.map((subCat) =>
                    subCat?.children?.map((thirdLavelCat, index) => (
                      <MenuItem value={thirdLavelCat?._id} key={index}>
                        {thirdLavelCat?.name}
                      </MenuItem>
                    )),
                  ),
                )}
              </Select>
            )}
          </div>

          <div className="col w-[20%] ml-auto">
            <SearchBox />
          </div>
        </div>

        <br />

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    {...label}
                    size="small"
                    onChange={handleSelectAll}
                    checked={
                      productData?.length > 0
                        ? productData.every((item) => item.checked)
                        : false
                    }
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading === false ? (
                productData?.length !== 0 &&
                productData
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((product, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          <Checkbox
                            {...label}
                            size="small"
                            checked={product.checked === true ? true : false}
                            onChange={(e) =>
                              handleCheckboxChange(e, product._id, index)
                            }
                          />
                        </TableCell>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          <div className="flex items-center gap-4 w-[300px]">
                            <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                              <Link to={`/product/${product?._id}`}>
                                <LazyLoadImage
                                  alt={"image"}
                                  effect="blur"
                                  src={product?.images[0]}
                                  className="w-full group-hover:scale-105"
                                />
                              </Link>
                            </div>
                            <div className="info w-[75%]">
                              <h3 className="font-[600] text-[12px] leading-4 hover:text-[#3872fa]">
                                <Link to={`/product/${product?._id}`}>
                                  {product?.name}
                                </Link>
                              </h3>
                              <span className="text-[12px]">
                                {product?.brand}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          {product?.catName}
                        </TableCell>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          {product?.subCat}
                        </TableCell>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          <div className="flex  gap-1 flex-col">
                            <span className="oldPrice line-through  leading-3 text-[14px] font-[500]">
                              &#8363; {product?.price}
                            </span>
                            <span className="price text-primary text-[14px] font-[600]">
                              &#8363; {product.oldPrice}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          <p className="text-[14px] w-[100px]">
                            <span className="font-[600]">{product?.sale}</span>{" "}
                            sale
                          </p>
                          {/* <ProgressBar value={40} type="success" /> */}
                        </TableCell>

                        <TableCell style={{ minWidth: columns.minWidth }}>
                          <p className="text-[14px] w-[100px]">
                            <Rating
                              name="half-rating"
                              size="small"
                              defaultValue={product?.rating}
                            />
                          </p>
                          {/* <ProgressBar value={40} type="success" /> */}
                        </TableCell>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          <div className="flex items-center gap-4">
                            <Button
                              className="!w-[35px] !h-[35px]  bg-[#f1f1f1] !min-w-[35px] !border !border-[rgba(0,0,0,0.1)] 
                    !rounded-full hover:!bg-[#f1f1f1]"
                              onClick={() =>
                                context.setIsOpenFullScreenPanel({
                                  open: true,
                                  model: "Edit Product",
                                  id: product?._id,
                                })
                              }
                            >
                              <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                            </Button>
                            <Link to={`/product/${product?._id}`}>
                              <Button
                                className="!w-[35px] !h-[35px]  bg-[#f1f1f1] !min-w-[35px] !border !border-[rgba(0,0,0,0.1)] 
                    !rounded-full hover:!bg-[#f1f1f1]"
                              >
                                <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                              </Button>
                            </Link>
                            <Button
                              className="!w-[35px] !h-[35px]  bg-[#f1f1f1] !min-w-[35px] !border !border-[rgba(0,0,0,0.1)] 
                    !rounded-full hover:!bg-[#f1f1f1]"
                              onClick={() => deleteProduct(product?._id)}
                            >
                              <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <>
                  <TableRow>
                    <TableCell colspan={8}>
                      <div className="flex items-center justify-center w-full min-h-[400px]">
                        <CircularProgress color="inherit" />
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={productData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

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

      <div className="card my-4 shadow-sm sm:rounded-lg bg-white/70 backdrop-blur-md border border-gray-200">
        <div className="flex items-center justify-between px-5 py-5 pb-0">
          <h2 className="text-[18px] font-[600]">Total Users & Total Sales</h2>
        </div>

        <div className="flex items-center gap-5 px-5 py-5 pt-1">
          <span
            className="flex items-center gap-1 text-[15px] cursor-pointer"
            onClick={getTotalUserByYear}
          >
            <span className="block w-[8px] h-[8px] rounded-full bg-[#0858f7]"></span>{" "}
            {/* ✅ xanh dương */}
            Total Users
          </span>

          <span
            className="flex items-center gap-1 text-[15px] cursor-pointer"
            onClick={getTotalSalesByYear}
          >
            <span className="block w-[8px] h-[8px] rounded-full bg-green-600"></span>{" "}
            {/* ✅ xanh lá */}
            Total Sales
          </span>
        </div>

        {chartData?.length !== 0 && (
          <BarChart
            width={1000}
            height={500}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="name"
              scale="point"
              tick={{ fontSize: 12 }}
              label={{ position: "insideBottom", fontSize: 14 }}
              style={{ fill: context?.theme === "dark" ? "white" : "#000" }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ position: "insideBottom", fontSize: 14 }}
              style={{ fill: context?.theme === "dark" ? "white" : "#000" }}
            />
            <Tooltip
              contentStyle={{
                background: "#071739",
                color: "white",
              }}
              labelStyle={{ color: "yellow" }}
              itemStyle={{ color: "cyan" }}
              cursor={{ fill: "white" }}
            />
            <Legend />
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              vertical={false}
            />
            <Bar dataKey="TotalSales" stackId="sales" fill="#16a34a" />{" "}
            {/* ✅ xanh lá = Sales (khớp legend) */}
            <Bar dataKey="TotalUsers" stackId="users" fill="#0858f7" />{" "}
            {/* ✅ xanh dương = Users (khớp legend) */}
          </BarChart>
        )}
      </div>
    </>
  );
};

export default Dashboard;
