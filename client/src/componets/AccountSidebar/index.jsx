import React, {  useContext, useEffect, useState } from 'react';
import { IoMdCloudUpload } from 'react-icons/io';
import { FaRegUser } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import { IoBagCheckOutline } from 'react-icons/io5';
import { IoIosLogOut } from 'react-icons/io';
import { NavLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import {  uploadImage } from '../../utils/api';

const AccountSidebar = () => {
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const context = useContext(MyContext);

  useEffect(() => {
    const userAvtar = [];
    if (context?.userData?.avatar !== '' && context?.userData?.avatar !== undefined) {
      userAvtar.push(context?.userData?.avatar);
      setPreviews(userAvtar);
    }
  }, [context?.userData]);

  let img_arr = [];
  let uniqueArray = [];

  // ❌ Lỗi phổ biến - formData dùng lại giữa các lần upload
  // khai báo ngoài hàm → bị tích lũy data cũ

  // ✅ Fix - khai báo mới mỗi lần gọi
  const onChangeFile = async (e, apiEndpoint) => {
    try {
      setPreviews([]);
      const files = e.target.files;
      setUploading(true);

      const formData = new FormData(); // ✅ tạo mới mỗi lần
      const selectdImages = []; // ✅ tạo mới mỗi lần

      for (var i = 0; i < files.length; i++) {
        if (
          files[i] &&
          (files[i].type === 'image/jpeg' ||
            files[i].type === 'image/jpg' ||
            files[i].type === 'image/png' ||
            files[i].type === 'image/webp')
        ) {
          const file = files[i];
          selectdImages.push(file);
          formData.append('images', file); // ✅ field name phải khớp upload.single('images')
        } else {
          context.alertBox('error', 'Please select a valid JPG, PNG or webp image file');
          setUploading(false);
          return false;
        }
      }

      uploadImage('/api/user/user-avatar', formData)
        .then((res) => {
          setUploading(false);
          if (res?.data?.avatar) {
            setPreviews([res.data.avatar]);
          }
        })
        .catch(() => {
          setUploading(false);
          context.alertBox('error', 'Upload failed');
        });
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <>
      <div className="card bg-white shadow-md rounded-md sticky top-[10px]">
        <div className="w-full p-5 flex items-center justify-center flex-col">
          <div
            className="w-[110px] h-[110px] rounded-full overflow-hidden mb-4 relative group 
          flex items-center justify-center bg-gray-200"
          >
            {uploading === true ? (
              <CircularProgress color="inherit" />
            ) : (
              <>
                {
                  previews?.length !== 0 ? (
                    previews?.map((img, index) => (
                      <img src={img} key={index} className="w-full h-full object-cover" />
                    ))
                  ) : (
                    <img src="/user.jpg" className="w-full h-full object-cover" />
                  ) // ✅ ternary đúng cách
                }
              </>
            )}

            <div
              className="overlay w-[100%] h-[100%] absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.7)] 
                  flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100"
            >
              <IoMdCloudUpload className="text-[#fff] text-[25px] " />
              <input
                type="file"
                className="absolute top-0 left-0 w-full h-full opacity-0"
                accept="image/*"
                onChange={(e) => onChangeFile(e, '/api/user/user-avatar')}
                name="avatar"
              />
            </div>
          </div>

          <h3>{context?.userData?.name}</h3>
          <h6 className="text-[13px] font-[500]">{context?.userData?.email}</h6>
        </div>

        <ul className="list-none pb-5 bg-[#f1f1f1] myAccountTabs">
          <li className="w-full">
            <NavLink to={'/my-account'} exact={true} activeClassNem="isActive">
              <Button
                className=" w-full !text-left !py-2 !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] 
                  !rounded-none flex items-center gap-2"
              >
                <FaRegUser className="text-[15px]" />
                My Profile
              </Button>
            </NavLink>
          </li>

          <li className="w-full">
            <NavLink to={'/my-list'} exact={true} activeClassNem="isActive">
              <Button
                className=" w-full !text-left !py-2 !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] 
                  !rounded-none flex items-center gap-2"
              >
                <FaRegHeart className="text-[17px]" />
                My List
              </Button>
            </NavLink>
          </li>

          <li className="w-full">
            <NavLink to={'/my-orders'} exact={true} activeClassNem="isActive">
              <Button
                className=" w-full !text-left !py-2 !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] 
                  !rounded-none flex items-center gap-2"
              >
                <IoBagCheckOutline className="text-[17px]" />
                My Orders
              </Button>
            </NavLink>
          </li>

          <li className="w-full">
            <Button
              className=" w-full !text-left !py-2 !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] 
                  !rounded-none flex items-center gap-2"
            >
              <IoIosLogOut className="text-[18px]" />
              Logout
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AccountSidebar;
