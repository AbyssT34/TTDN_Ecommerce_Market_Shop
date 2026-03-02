// import Link from 'next/link'
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Search from '../Search/index';
import { IoIosGitCompare } from 'react-icons/io';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { styled } from '@mui/material/styles';
import { FaRegHeart } from 'react-icons/fa';
import Navigation from './Navigation';
import { MyContext } from '../../App';
import { FaRegUser } from 'react-icons/fa';
import { IoBagCheckOutline } from 'react-icons/io5';
import { IoIosLogOut } from 'react-icons/io';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

// import Nav from './nav';

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

const Header = () => {
  const context = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <header className="bg-white">
        <div className="top-strip py-2 border-t-[1px] border-gray-250  border-b-[1px] ">
          <div className="container">
            <div className="flex items-center justify-between">
              <div className="col1 w-[50%]">
                <p className="text-[13px] font-[500]">
                  Get up to 50% off new season styles, limited time only
                </p>
              </div>
              <div className="col2 flex items-center justify-end">
                <ul className="flex items-center gap-3">
                  <li className="list-none">
                    <Link to="/help-center" className="text-[13px] link font-[500] transform">
                      Help Center
                    </Link>
                  </li>
                  <li className="list-none">
                    <Link to="/order-tracking" className="text-[13px] link font-[500] transform">
                      Order Tracking
                    </Link>
                  </li>
                  {/* <li className='list-none'>
                                    <Link to="help-center" className='text-[13px] link font-[500] transform'>Help Center</Link>
                                </li>
                                 <li className='list-none'>
                                    <Link to="help-center" className='text-[13px] link font-[500] transform'>Help Center</Link>
                                </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="top-strip py-2 border-b-[1px] border-gray-250 ">
          <div className="container flex items-center justify-between">
            <div className="logo">
              <Link to={'/'}>
                <img src="/logo1.jpg" alt="logo" className="w-[220px] h-[85px]" />
              </Link>
            </div>
            <Search />
            <div className="col3 flex items-center justify-end gap-5">
              {context.islogin === false ? (
                <>
                  <div className="flex items-center gap-2">
                    <Link to="/login" className=" link transition text-[15px] font-[500]">
                      Login
                    </Link>
                    <span className="text-[15px] font-[600] text-gray-600">|</span>
                    <Link to="/Register" className="link transition text-[15px] font-[500]">
                      Register
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    className="!text-[#000] myAccountWrap flex items-center gap-3 cursor-pointer"
                    onClick={handleClick}
                  >
                    <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !bg-[#f1f1f1]">
                      <FaRegUser className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                    </Button>

                    <div className="info flex flex-col">
                      <h4 className="leading-3 text-[14px] font-[500] text-[rgba(0,0,0,0.6)] mb-0 capitalize text-left justify-start">
                        Vịnh Trần
                      </h4>
                      <span className="text-[13px] font-[400] text-[rgba(0,0,0,0.6)] capitalize text-left justify-start">
                        quocvinhtran.0212@gmail.com
                      </span>
                    </div>
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          mt: 1.5,
                          '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Link to={'/my-account'} className="w-full block">
                      <MenuItem onClick={handleClose} className="flex gap-2 !py-3">
                        <FaRegUser className="text-[18px]" />{' '}
                        <span className="text-[14px]"> My Account</span>
                      </MenuItem>
                    </Link>
                    <Link to={'/my-orders'} className="w-full block">
                      <MenuItem onClick={handleClose} className="flex gap-2 !py-3">
                        <IoBagCheckOutline className="text-[18px]" />{' '}
                        <span className="text-[14px]"> Orders</span>
                      </MenuItem>
                    </Link>
                    <Link to={'/my-list'} className="w-full block">
                      <MenuItem onClick={handleClose} className="flex gap-2 !py-3">
                        <FaRegHeart className="text-[18px]" />{' '}
                        <span className="text-[14px]"> My List</span>
                      </MenuItem>
                    </Link>
                    <MenuItem onClick={handleClose} className="flex gap-2 !py-3">
                      <IoIosLogOut className="text-[18px]" />{' '}
                      <span className="text-[14px]"> Logout</span>
                    </MenuItem>
                  </Menu>
                </>
              )}

              <IconButton className="!min-w-[45px] !w-[45px] !h-[45px] !rounded-full !bg-gray-100 hover:!bg-gray-200">
                <IoIosGitCompare size={20} className="text-gray-700" />
                <CartBadge badgeContent={5} color="primary" overlap="circular" />
              </IconButton>

              <IconButton className="!min-w-[45px] !w-[45px] !h-[45px] !rounded-full !bg-gray-100 hover:!bg-gray-200">
                <FaRegHeart size={20} className="text-gray-700" />
                <CartBadge badgeContent={5} color="primary" overlap="circular" />
              </IconButton>

              <IconButton
                className="!min-w-[45px] !w-[45px] !h-[45px] !rounded-full !bg-gray-100 hover:!bg-gray-200"
                onClick={() => context.setOpenCartPanel(true)}
              >
                <AiOutlineShoppingCart size={20} className="text-gray-700" />
                <CartBadge badgeContent={5} color="primary" overlap="circular" />
              </IconButton>
            </div>
          </div>
        </div>

        <Navigation />
      </header>
    </>
  );
};

export default Header;
