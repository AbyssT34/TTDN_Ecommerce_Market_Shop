import React, { useContext, useState, useEffect } from "react";
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
import { deleteData, fetchDataFromApi } from "../../utils/api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const columns = [
  { id: "image", label: "IMAGE", minWidth: 150 },
  { id: "catName", label: "CATEGORY NAME", minWidth: 150 },
  { id: "action", label: "ACTION", minWidth: 100 },
];

const Categegory = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const context = useContext(MyContext);

    useEffect(() => {
      fetchDataFromApi(`/api/category`).then((res) => {
      context?.setCatData(res?.data);
      });
    }, [context]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteCat = (id) => {
    deleteData(`/api/category/${id}`).then(() => {
      fetchDataFromApi(`/api/category`).then((res) => {
        context?.setCatData(res?.data);
      });
    });
  };

  return (
    <>
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[18px] font-[700]">
          Category List
          <span className="text-[14px] font-[400]">(Materia Ui Table )</span>
        </h2>

        <div className="col w-[25%] ml-auto flex items-center justify-end gap-3">
          <Button className="btn !bg-green-600 !text-white btn-sm ">
            Export
          </Button>
          <Button
            className="btn-blue  !text-white btn-sm"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add New Category",
              })
            }
          >
            Add New Category
          </Button>
        </div>
      </div>
      <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    width={column.width}
                    key={column.id}
                    align={column.align}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {context?.catData?.length !== 0 &&
                context?.catData?.map((item, index) => {
                  return (
                    <>
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-4 w-[50px]">
                            <div className="img w-full rounded-md overflow-hidden group">
                              <Link to={"/product/45745"} data-discover="true">
                                <LazyLoadImage
                                  alt={"image"}
                                  effect="blur"
                                  className="w-full group-hover:scale-105 transition-all"
                                  src={item.images[0]}
                                />
                              </Link>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell width={300}>{item.name}</TableCell>
                        <TableCell width={200}>
                          <div className="flex items-center gap-1">
                            <Button
                              className="!w-[35px] !h-[35px]  bg-[#f1f1f1] !min-w-[35px] !border !border-[rgba(0,0,0,0.1)] 
                    !rounded-full hover:!bg-[#f1f1f1]"
                              onClick={() =>
                                context.setIsOpenFullScreenPanel({
                                  open: true,
                                  model: "Edit Category",
                                  id: item._id,
                                })
                              }
                            >
                              <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                            </Button>
                            <Button
                              className="!w-[35px] !h-[35px]  bg-[#f1f1f1] !min-w-[35px] !border !border-[rgba(0,0,0,0.1)] 
                    !rounded-full hover:!bg-[#f1f1f1]"
                              onClick={() => deleteCat(item?._id)}
                            >
                              <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={10}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};

export default Categegory;
