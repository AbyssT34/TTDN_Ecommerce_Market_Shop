import React, { useContext, useEffect, useState } from 'react';
import { IoMdCloudUpload } from 'react-icons/io';
import { FaRegUser } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import { IoBagCheckOutline } from 'react-icons/io5';
import { IoIosLogOut } from 'react-icons/io';
import { NavLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { uploadImage } from '../../utils/api';
import { LuMapPinCheck } from 'react-icons/lu';
import { LuMapPin } from 'react-icons/lu';

const AccountSidebar = () => {
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const context = useContext(MyContext);

  useEffect(() => {
    if (context?.userData?.avatar !== '' && context?.userData?.avatar !== undefined) {
      setPreviews([context?.userData?.avatar]);
    }
  }, [context?.userData]);

  const onChangeFile = async (e) => {
    try {
      const files = e.target.files;

      if (!files || files.length === 0) return;

      // Validate file type
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        context.alertBox('error', 'Please select a valid JPG, PNG or WEBP image file');
        return;
      }

      setUploading(true);
      setPreviews([]);

      // ✅ field name 'avatar' khớp với backend multer
      const formData = new FormData();
      formData.append('avatar', file);

      uploadImage('/api/user/user-avatar', formData)
        .then((res) => {
          setUploading(false);
          // ✅ backend trả { avatar, _id, success }
          if (res?.avatar) {
            setPreviews([res.avatar]);
            // ✅ update context để toàn app cập nhật avatar
            context.setUserData((prev) => ({
              ...prev,
              avatar: res.avatar,
            }));
            context.alertBox('success', 'Avatar updated successfully');
          } else {
            context.alertBox('error', 'Upload failed');
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
      <div className="card bg-white shadow-md rounded-md sticky top-[160px]">
        <div className="w-full p-5 flex items-center justify-center flex-col">
          <div
            className="w-[110px] h-[110px] rounded-full overflow-hidden mb-4 relative group 
            flex items-center justify-center bg-gray-200"
          >
            {uploading ? (
              <CircularProgress color="inherit" />
            ) : (
              <>
                {previews?.length > 0 ? (
                  <img src={previews[0]} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <img
                    src="/user.jpg"
                    alt="default avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </>
            )}

            {/* Upload overlay */}
            <div
              className="overlay w-full h-full absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.7)] 
              flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100"
            >
              <IoMdCloudUpload className="text-white text-[25px]" />
              <input
                type="file"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={onChangeFile}
                name="avatar"
              />
            </div>
          </div>

          <h3 className="font-[600]">{context?.userData?.name}</h3>
          <h6 className="text-[13px] font-[500] text-gray-500">{context?.userData?.email}</h6>
        </div>

        <ul className="list-none pb-5 bg-[#f1f1f1] myAccountTabs">
          <li className="w-full">
            <NavLink to={'/my-account'} end>
              <Button
                className="w-full !text-left !py-2 !px-5 !justify-start !capitalize 
                  !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2"
              >
                <FaRegUser className="text-[15px]" />
                My Profile
              </Button>
            </NavLink>
          </li>

          <li className="w-full">
            <NavLink to={'/address'}>
              <Button
                className="w-full !text-left !py-2 !px-5 !justify-start !capitalize 
                  !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2"
              >
                <LuMapPin className="text-[17px]" />
                Address
              </Button>
            </NavLink>
          </li>

          <li className="w-full">
            <NavLink to={'/my-list'}>
              <Button
                className="w-full !text-left !py-2 !px-5 !justify-start !capitalize 
                  !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2"
              >
                <FaRegHeart className="text-[17px]" />
                My List
              </Button>
            </NavLink>
          </li>

          <li className="w-full">
            <NavLink to={'/my-orders'}>
              <Button
                className="w-full !text-left !py-2 !px-5 !justify-start !capitalize 
                  !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2"
              >
                <LuMapPinCheck className="text-[17px]" />
                My Orders
              </Button>
            </NavLink>
          </li>

          <li className="w-full">
            <Button
              className="w-full !text-left !py-2 !px-5 !justify-start !capitalize 
                !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2"
              onClick={() => context.logout()}
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
