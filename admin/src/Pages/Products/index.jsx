import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { IoMdAdd } from "react-icons/io";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import ProgressBar from "../../Components/ProgressBar";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import SearchBox from "../../Components/SearchBox";
import { MyContext } from "../../App";
import {
  deleteData,
  deleteMultipleData,
  fetchDataFromApi,
} from "../../utils/api";
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

const Products = () => {
  const [productCat, setProductCat] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [productData, setProductData] = useState([]);
  const [productSubCat, setProductSubCat] = useState("");
  const [productThirLaveldCat, setProductThirLaveldCat] = useState("");
  const [sortedIds, setSortedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);

  useEffect(() => {
    getProducts();
  }, [context?.refreshData]);
  // ✅ watch refreshData thay vì setIsOpenFullScreenPanel


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

  const deleteProduct = (id) => {
    deleteData(`/api/product/${id}`).then((res) => {
      getProducts();
      context.alertBox("success", "Product deleted");
    });
  };

  const deleteMultipleProduct = () => {
    if (sortedIds.length === 0) {
      context.alertBox("error", "please select items to delete");
    }

    console.log(sortedIds);

    try {
      deleteMultipleData(`/api/product/deleteMultiple`, sortedIds).then(
        (res) => {
          console.log(res);
          getProducts();
          context.alertBox("success", "Product deleted");
        },
      );
    } catch (error) {
      context.alertBox("error", "Error deleting item");
    }
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  return (
    <>
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[18px] font-[700]">
          Products{" "}
          <span className="text-[14px] font-[400]">(Materia Ui Table )</span>
        </h2>

        <div className="col w-[25%] ml-auto flex items-center justify-end gap-3">
          {sortedIds?.length !== 0 && (
            <Button
              variant="contained"
              className=" btn-sm"
              onClick={deleteMultipleProduct}
            >
              Delete
            </Button>
          )}
          <Button className="btn !bg-green-600 !text-white btn-sm ">
            Export
          </Button>
          <Button
            className="btn-blue  !text-white btn-sm"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add Product",
              })
            }
          >
            Add Product
          </Button>
        </div>
      </div>

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
    </>
  );
};

export default Products;
