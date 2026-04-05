import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { FaCloudUploadAlt } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { MyContext } from "../../App";
import {
  deleteData,
  editData,
  fetchDataFromApi,
  postData,
} from "../../utils/api";

const AddRams = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState("");

  const context = useContext(MyContext);
  // ✅ Tách thành hàm riêng để tái sử dụng
  const getRams = () => {
    fetchDataFromApi(`/api/product/productRams/get`).then((res) => {
      if (res?.error === false) {
        setData(res?.data);
      }
    });
  };

  useEffect(() => {
    getRams();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || name === "") {
      context.alertBox("error", "Please enter product Ram name");
      return false;
    }

    setIsLoading(true);

    // ✅ Chỉ 1 trong 2 nhánh, không gọi postData 2 lần
    if (editId === "") {
      postData(`/api/product/productRams/create`, { name }).then((res) => {
        if (res?.error === false) {
          context.alertBox("success", res?.message);
          setName("");
          setEditId("");
          getRams();
        } else {
          context.alertBox("error", res?.message);
        }
        setIsLoading(false);
      });
    } else {
      editData(`/api/product/productRams/${editId}`, { name }).then((res) => {
        if (res?.data?.error === false) {
          context.alertBox("success", res?.data?.message);
          setName("");
          setEditId(""); // ✅ reset editId sau khi edit xong
          getRams();
        } else {
          context.alertBox("error", res?.data?.message);
        }
        setIsLoading(false);
      });
    }
  };

  const editItem = (id) => {
    fetchDataFromApi(`/api/product/productRams/${id}`).then((res) => {
      console.log("editItem response:", res); // ✅ xem structure
      // ✅ fetchDataFromApi trả về data trực tiếp (axios đã unwrap)
      setName(res?.data?.name);
      setEditId(res?.data?._id); // nếu không hiện, đổi thành res?.name và res?._id
    });
  };

  const deleteItems = (id) => {
    deleteData(`/api/product/productRams/${id}`).then((res) => {
      getRams();
      context.alertBox("success", "Item deleted");
    });
  };

  return (
    <>
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[18px] font-[700]">Add Product Rams</h2>
      </div>
      <div className="card my-4 pt-5 pb-5 shadow-md sm:rounded-lg bg-white w-[65%]">
        <form className="form py-3 p-6" onSubmit={handleSubmit}>
          <div className="col mb-4">
            <h3 className="text-[14px] font-[500] mb-1 text-black">
              Product Rams
            </h3>
            <input
              type="text"
              className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">
            {isLoading === true ? (
              <CircularProgress color="inherit" />
            ) : (
              <>
                <FaCloudUploadAlt className="text-[25px] text-white" />
                Publish and View
              </>
            )}
          </Button>
        </form>
      </div>

      {data?.length !== 0 && (
        <div className="card my-4 pt-5 pb-5 shadow-md sm:rounded-lg bg-white w-[65%]">
          <div className="relative overflow-x-auto mt-5 pb-5">
            <table className=" w-full text-sm text-left rtl:text-right text-gray-700 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 whitespace-nowrap"
                    width="60%"
                  >
                    PRODUCT RAM
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 whitespace-nowrap"
                    width="30%"
                  >
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => {
                  return (
                    <tr
                      className="odd:bg-white 
               even:bg-gray-50 border-gray-200"
                      key={index}
                    >
                      <td className="px-6 py-2">
                        <span className="font-600">{item?.name}</span>
                      </td>
                      <td className="px-6 py-2">
                        <div className="flex items-center gap-4">
                          <Button
                            className="!w-[35px] !h-[35px]  bg-[#f1f1f1] !min-w-[35px] !border !border-[rgba(0,0,0,0.1)] 
                    !rounded-full hover:!bg-[#f1f1f1]"
                            onClick={() => editItem(item?._id)}
                          >
                            <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                          </Button>

                          <Button
                            className="!w-[35px] !h-[35px]  bg-[#f1f1f1] !min-w-[35px] !border !border-[rgba(0,0,0,0.1)] 
                    !rounded-full hover:!bg-[#f1f1f1]"
                            onClick={() => deleteItems(item?._id)}
                          >
                            <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default AddRams;
