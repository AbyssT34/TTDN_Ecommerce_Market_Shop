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
import { Link, useNavigate } from "react-router-dom";
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

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
  { id: "image", label: "IMAGE", minWidth: 150 },
  { id: "action", label: "ACTION", minWidth: 100 },
];

const BannersV1List = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [slidesData, setSlidesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortedIds, setSortedIds] = useState([]);
  

  const context = useContext(MyContext);
  const histoty = useNavigate();

  useEffect(() => {
    getData();
  }, [context?.isOpenFullScreenPanel]);

  const getData = () => {
    fetchDataFromApi(`/api/bannerV1`).then((res) => {
      let arr = [];
      if (res?.error === false) {
        for (let i = 0; i < res?.data?.length; i++) {
          arr[i] = res?.data[i];
          arr[i].checked = false;
          console.log(arr[i]);
        }
        setTimeout(() => {
          setSlidesData(arr);
          setIsLoading(false);
        }, 300);
      }
    });
  };

  //Handler to toggle all checkboxes
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;

    //update all items checked status
    const updateItems = slidesData.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setSlidesData(updateItems);

    //Update the sorted IDs state
    if (isChecked) {
      const ids = updateItems.map((item) => item._id).sort((a, b) => a - b);
      setSortedIds(ids);
    } else {
      setSortedIds([]);
    }
  };

  const handleCheckboxChange = (e, id, index) => {
    const updateItems = slidesData.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item,
    );

    setSlidesData(updateItems);

    //Update the sorted IDs state
    const selectedIds = updateItems
      .filter((item) => item.checked)
      .map((item) => item._id)
      .sort((a, b) => a - b);
    setSortedIds(selectedIds);
  };

  const deleteMultipleProduct = () => {
    if (sortedIds.length === 0) {
      context.alertBox("error", "please select items to delete");
    }

    console.log(sortedIds);

    try {
      deleteMultipleData(`/api/bannerV1/deleteMultiple`, sortedIds).then(
        (res) => {
          console.log(res);
          getData();
          context.alertBox("success", "Product deleted");
        },
      );
    } catch (error) {
      context.alertBox("error", "Error deleting item");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteSliede = (id) => {
    deleteData(`/api/bannerV1/${id}`).then((res) => {
      context.alertBox("success", "Banner deleted");
      getData();
    });
  };

  return (
    <>
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[18px] font-[700]">
           Banners List{" "}
          <span className="text-[14px] font-[400]">(Materia Ui Table )</span>
        </h2>

        <div className="col w-[25%] ml-auto flex items-center justify-end gap-3">
          {sortedIds?.length !== 0 && (
            <Button
              variant="contained"
              className=" btn-sm"
              color="error"
              onClick={deleteMultipleProduct}
            >
              Delete
            </Button>
          )}
          <Button
            className="btn-blue  !text-white btn-sm"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add BannerV1",
              })
            }
          >
            Add BannerV1
          </Button>
        </div>
      </div>
      <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell width={60}>
                  <Checkbox
                    {...label}
                    size="small"
                    onChange={handleSelectAll}
                    checked={
                      slidesData?.length > 0
                        ? slidesData.every((item) => item.checked)
                        : false
                    }
                  />
                </TableCell>
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
              {slidesData?.length !== 0 &&
                slidesData?.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell width={200}>
                        <Checkbox
                          {...label}
                          size="small"
                          checked={item.checked === true ? true : false}
                          onChange={(e) =>
                            handleCheckboxChange(e, item._id, index)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4 w-[300px]">
                          <div className="img w-full rounded-md overflow-hidden group">
                            <img
                              src={item?.images?.[0]}
                              className="w-full group-hover:scale-105 transition-all"
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell width={300}>
                        <div className="flex items-center gap-1">
                          <Button
                            className="!w-[35px] !h-[35px]  bg-[#f1f1f1] !min-w-[35px] !border !border-[rgba(0,0,0,0.1)] 
                    !rounded-full hover:!bg-[#f1f1f1]"
                            onClick={() =>
                              context.setIsOpenFullScreenPanel({
                                open: true,
                                model: "Edit BannerV1",
                                id: item._id,
                              })
                            }
                          >
                            <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                          </Button>

                          <Button
                            className="!w-[35px] !h-[35px]  bg-[#f1f1f1] !min-w-[35px] !border !border-[rgba(0,0,0,0.1)] 
                    !rounded-full hover:!bg-[#f1f1f1]"
                            onClick={() => deleteSliede(item?._id)}
                          >
                            <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
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

export default BannersV1List;
