import React, { useContext, useState, forwardRef } from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { FaRegBell } from "react-icons/fa";
import { RiMenu2Line } from "react-icons/ri";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { FaRegUser } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import AddProduct from "../../Pages/Products/addProduct";
import AddHomeSlide from "../../Pages/HomeSliderBanners/addHomeSlide";
import AddCategory from "../../Pages/Categegory/addCategory";
import AddSubCategory from "../../Pages/Categegory/addSubCategory";
import AddAddress from "../../Pages/Address";
import EditCategory from "../../Pages/Categegory/editCategory";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import EditProduct from "../../Pages/Products/editProduct";


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Header = () => {
  const [anchorElMyAcc, setAnchorElMyAcc] = useState(null);
  const openMyAcc = Boolean(anchorElMyAcc);
  const handleClickMyAcc = (event) => {
    setAnchorElMyAcc(event.currentTarget);
  };
  const handleCloseMyAcc = () => {
    setAnchorElMyAcc(null);
  };

  const context = useContext(MyContext);
 const histoty = useNavigate();

  const Logout = () => {
    setAnchorElMyAcc(null);

    fetchDataFromApi(
      `/api/user/logout?token=${localStorage.getItem("accesstoken")}`,
      {
        withCredentials: true,
      },
    ).then((res) => {
      if (res?.error === false) {
        context.setIsLogin(false);
        localStorage.removeItem("accesstoken", res?.accesstoken);
        localStorage.removeItem("refreshToken", res?.refreshToken);
        histoty("/login");
      }
    });
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  return (
    <>
      <header
        className={`w-full h-[auto] py-2 ${
          context.isSiderOpen === true ? "pl-70" : "pl-5"
        } shadow-md pr-7 bg-[#fff] 
      flex items-center justify-between transition-all fixed top-0 left-0`}
      >
        <div className="part1">
          <Button
            className="!w-[40px] !h-[40px] !rounded-full !min-w-[40px] !text-[rgba(0,0,0,0.8)]"
            onClick={() => context.setIsSiderOpen(!context.isSiderOpen)}
          >
            {context.isSiderOpen === true ? (
              <RiMenu2Line className="text-[18px] text-[rgba(0,0,0,0.8)]" />
            ) : (
              <RiMenu2Line className="text-[18px] text-[rgba(0,0,0,0.8)]" />
            )}
          </Button>
        </div>

        <div className="part2 w-[40%] flex items-center justify-end gap-5">
          <IconButton aria-label="cart">
            <StyledBadge badgeContent={4} color="secondary">
              <FaRegBell />
            </StyledBadge>
          </IconButton>

          {context.islogin === true ? (
            <div className="relative">
              <div
                className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer"
                onClick={handleClickMyAcc}
              >
                <img src="/user.jpg" className="w-full h-full object-cover" />
              </div>

              <Menu
                anchorEl={anchorElMyAcc}
                id="account-menu"
                open={openMyAcc}
                onClose={handleCloseMyAcc}
                onClick={handleCloseMyAcc}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleCloseMyAcc} className="!bg-[white]">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer">
                      <img
                        src="/user.jpg"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="info">
                      <h3 className="text-[15px] font-[500] leading-5">
                        {context?.userData?.name}
                      </h3>
                      <p className="text-[12px] font-[400] opacity-70">
                        {context?.userData?.email}
                      </p>
                    </div>
                  </div>
                </MenuItem>

                <Divider />

                <Link to="/profile">
                  <MenuItem
                    onClick={handleCloseMyAcc}
                    className="flex items-center gap-3"
                  >
                    <FaRegUser className="text-[16px]" />{" "}
                    <span className="text-[14px]">Profile</span>
                  </MenuItem>
                </Link>
                <MenuItem onClick={Logout} className="flex items-center gap-3">
                  <IoMdLogOut className="text-[16px]" />{" "}
                  <span className="text-[14px]">Sign Out</span>
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Link to={"/login"}>
              <Button className="btn-blue btn-sm !rounded-full">Sign In</Button>
            </Link>
          )}
        </div>
      </header>

      <Dialog
        fullScreen
        open={context?.isOpenFullScreenPanel.open}
        onClose={() =>
          context?.setIsOpenFullScreenPanel({
            open: false,
          })
        }
        slots={{
          transition: Transition,
        }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() =>
                context?.setIsOpenFullScreenPanel({
                  open: false,
                })
              }
              aria-label="close"
            >
              <IoMdClose className="text-gray-800" />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <span className="text-gray-800">
                {context?.isOpenFullScreenPanel.model}
              </span>
            </Typography>
          </Toolbar>
        </AppBar>
        {context?.isOpenFullScreenPanel.model === "Add Product" && (
          <AddProduct />
        )}
        {context?.isOpenFullScreenPanel.model === "Add Home Slide" && (
          <AddHomeSlide />
        )}
        {context?.isOpenFullScreenPanel.model === "Add New Category" && (
          <AddCategory />
        )}
        {context?.isOpenFullScreenPanel.model === "Add New Sub Category" && (
          <AddSubCategory />
        )}
        {context?.isOpenFullScreenPanel.model === "Add New Address" && (
          <AddAddress />
        )}
        {context?.isOpenFullScreenPanel.model === "Edit Category" && (
          <EditCategory />
        )}
        {context?.isOpenFullScreenPanel.model === "Edit Product" && (
          <EditProduct />
        )}
        {context?.isOpenFullScreenPanel.model === "Add HomeSlide" && (
          <AddHomeSlide />
        )}
      </Dialog>
    </>
  );
};

export default Header;
