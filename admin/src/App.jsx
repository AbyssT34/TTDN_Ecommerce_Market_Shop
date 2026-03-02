import "./App.css";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Header from "./Components/Header";
import SideBar from "./Components/SideBar";
import { createContext, forwardRef, useState } from "react";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Products from "./Pages/Products";
import AddProduct from "./Pages/Products/addProduct";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import Slide from "@mui/material/Slide";
import HomeSliderBanners from "./Pages/HomeSliderBanners";
import AddHomeSlide from "./Pages/HomeSliderBanners/addHomeSlide";
import Categegory from "./Pages/Categegory";
import AddCategory from "./Pages/Categegory/addCategory";
import SubCatList from "./Pages/Categegory/subCatList";
import AddSubCategory from "./Pages/Categegory/addSubCategory";
import Users from "./Pages/Users";
import Orders from "./Pages/Orders";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyAccount from "./Pages/VerifyAccount";
import ChangePassword from "./Pages/ChangePassword";

// ✅ Khai báo context ở ngoài hàm App
const MyContext = createContext();

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {
  const [isSiderOpen, setIsSiderOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
    open: false,
    model: "",
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSiderOpen === true ? "w-[18%]" : "w-[0px] opacity-0"
                } transition-all`}
              >
                <SideBar />
              </div>
              <div
                className={`contentRight py-4 px-5  ${
                  isSiderOpen === false ? "w-[100%]" : "w-[82%]"
                } transition-all`}
              >
                <Dashboard />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/login",
      element: (
        <>
          <Login />
        </>
      ),
    },
    {
      path: "/sign-up",
      element: (
        <>
          <SignUp />
        </>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <>
          <ForgotPassword />
        </>
      ),
    },
    {
      path: "/verify-account",
      element: (
        <>
          <VerifyAccount />
        </>
      ),
    },
    {
      path: "/change-password",
      element: (
        <>
          <ChangePassword />
        </>
      ),
    },

    {
      path: "/products",
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSiderOpen === true ? "w-[18%]" : "w-[0px] opacity-0"
                } transition-all`}
              >
                <SideBar />
              </div>
              <div
                className={`contentRight py-4 px-5  ${
                  isSiderOpen === false ? "w-[100%]" : "w-[82%]"
                } transition-all`}
              >
                <Products />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/homeSlider/list",
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSiderOpen === true ? "w-[18%]" : "w-[0px] opacity-0"
                } transition-all`}
              >
                <SideBar />
              </div>
              <div
                className={`contentRight py-4 px-5  ${
                  isSiderOpen === false ? "w-[100%]" : "w-[82%]"
                } transition-all`}
              >
                <HomeSliderBanners />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/category/list",
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSiderOpen === true ? "w-[18%]" : "w-[0px] opacity-0"
                } transition-all`}
              >
                <SideBar />
              </div>
              <div
                className={`contentRight py-4 px-5  ${
                  isSiderOpen === false ? "w-[100%]" : "w-[82%]"
                } transition-all`}
              >
                <Categegory />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/subCategory/list",
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSiderOpen === true ? "w-[18%]" : "w-[0px] opacity-0"
                } transition-all`}
              >
                <SideBar />
              </div>
              <div
                className={`contentRight py-4 px-5  ${
                  isSiderOpen === false ? "w-[100%]" : "w-[82%]"
                } transition-all`}
              >
                <SubCatList />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/user",
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSiderOpen === true ? "w-[18%]" : "w-[0px] opacity-0"
                } transition-all`}
              >
                <SideBar />
              </div>
              <div
                className={`contentRight py-4 px-5  ${
                  isSiderOpen === false ? "w-[100%]" : "w-[82%]"
                } transition-all`}
              >
                <Users />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/orders",
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSiderOpen === true ? "w-[18%]" : "w-[0px] opacity-0"
                } transition-all`}
              >
                <SideBar />
              </div>
              <div
                className={`contentRight py-4 px-5  ${
                  isSiderOpen === false ? "w-[100%]" : "w-[82%]"
                } transition-all`}
              >
                <Orders />
              </div>
            </div>
          </section>
        </>
      ),
    },
  ]);

  const values = {
    isSiderOpen,
    setIsSiderOpen,
    isLogin,
    setIsLogin,
    isOpenFullScreenPanel,
    setIsOpenFullScreenPanel,
  };

  return (
    <MyContext.Provider value={values}>
      <RouterProvider router={router} />

      <Dialog
        fullScreen
        open={isOpenFullScreenPanel.open}
        onClose={() =>
          setIsOpenFullScreenPanel({
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
                setIsOpenFullScreenPanel({
                  open: false,
                })
              }
              aria-label="close"
            >
              <IoMdClose className="text-gray-800" />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <span className="text-gray-800">
                {isOpenFullScreenPanel?.model}
              </span>
            </Typography>
          </Toolbar>
        </AppBar>
        {isOpenFullScreenPanel?.model === "Add Product" && <AddProduct />}
        {isOpenFullScreenPanel?.model === "Add Home Slide" && <AddHomeSlide />}
        {isOpenFullScreenPanel?.model === "Add New Category" && <AddCategory />}
        {isOpenFullScreenPanel?.model === "Add New Sub Category" && (
          <AddSubCategory />
        )}
      </Dialog>
    </MyContext.Provider>
  );
}

export default App;
export { MyContext }; // ✅ Bây giờ hợp lệ
