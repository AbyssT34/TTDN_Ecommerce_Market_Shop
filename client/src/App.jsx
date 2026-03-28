import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './componets/Header';
import Footer from './componets/Footer';
import Home from './Page/Home';
import ProductListing from './Page/ProductListing';
import ProductDetails from './Page/ProductDetails';
import { createContext, useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ProductZoom from './componets/ProductZoom';
import { IoCloseSharp } from 'react-icons/io5';
import ProductDetailsComponent from './componets/ProductDetails';
import Login from './Page/Login';
import Register from './Page/Register';
import CartPage from './Page/Cart';
import Verify from './Page/Verify';
import Checkout from './Page/Checkout';

import toast, { Toaster } from 'react-hot-toast';
import ForgotPassword from './Page/ForgotPassword';
import MyAccount from './Page/MyAccount';
import MyList from './Page/MyList';
import Orders from './Page/Orders';
import { fetchDataFromApi, postData } from './utils/api';
import Address from './Page/MyAccount/address';

const MyContext = createContext();

function App() {
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState({
    open: false,
    item: {},
  });
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lg');
  const [islogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [catData, setCatData] = useState([]);
  const [cartData, setCartData] = useState([]);

  // const handleClickOpenProductDetailsModal = () => {
  //   setOpenProductDetailsModal(true);
  // };

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('accesstoken');

    if (token !== undefined && token !== null && token !== '') {
      setIsLogin(true);

      fetchDataFromApi(`/api/user/user-details`).then((res) => {
        setUserData(res?.data);
        console.log(res?.response?.data?.error);
        if (res?.response?.data?.error === true) {
          if (res?.response?.data?.message) {
            localStorage.removeItem('accesstoken');
            localStorage.removeItem('refreshToken');

            alertBox('error', 'Your session is closed please login again');

            window.location.href = '/login';
          }
        }
      });

      getCartItems();
    } else {
      setIsLogin(false);
    }
  }, [islogin]);

  const openAlertBox = (status, msg) => {
    if (status === 'success') {
      toast.success(msg);
    }
    if (status === 'error') {
      toast.error(msg);
    }
  };

  useEffect(() => {
    fetchDataFromApi(`/api/category`).then((res) => {
      if (res?.success === true) {
        setCatData(res?.data);
      }
    });
  }, []);

  const alertBox = (type, msg) => {
    if (type === 'success') {
      toast.success(msg);
    }
    if (type === 'error') {
      toast.error(msg);
    }
  };

  const handleOpenProductDetailsModal = (status, item) => {
    setOpenProductDetailsModal({
      open: status,
      item: item,
    });
  };

  const handleCloseProductDetailsModal = () => {
    setOpenProductDetailsModal({
      open: false,
      item: {},
    });
  };

  const addToCart = (product, userId, quantity) => {
    if (userId === undefined) {
      alertBox('error', 'you are not login please login first');

      return false;
    }

    const data = {
      productTitle: product?.name,
      image: product?.image,
      rating: product?.rating,
      price: product?.price,
      oldPrice: product?.oldPrice,
      discount: product?.discount,
      quantity: quantity,
      subTotal: parseInt(product?.price * quantity),
      productId: product?._id,
      countInStock: product?.countInStock,
      brand: product?.brand,
      size: product?.size,
      weight: product?.weight,
      ram: product?.ram,
      userId: userId,
    };

    postData(`/api/cart/add`, data).then((res) => {
      if (res?.error === false) {
        alertBox('success', res?.message);

        getCartItems();
      } else {
        alertBox('error', res?.message);
      }
    });
  };

  const getCartItems = () => {
    fetchDataFromApi(`/api/cart/get`).then((res) => {
      if (res?.error === false) {
        setCartData(res?.data);
      }
    });
  };

  const values = {
    setOpenProductDetailsModal,
    handleOpenProductDetailsModal,
    setOpenCartPanel,
    openCartPanel,
    toggleCartPanel,
    openAlertBox,
    islogin,
    setIsLogin,
    alertBox,
    setUserData,
    userData,
    catData,
    setCatData,
    addToCart,
    cartData,
    getCartItems,
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <Routes>
            <Route path={'/'} exact={true} element={<Home />} />
            <Route path={'/ProductListing'} exact={true} element={<ProductListing />} />
            <Route path={'/Product/:id'} exact={true} element={<ProductDetails />} />
            <Route path={'/login'} exact={true} element={<Login />} />
            <Route path={'/Register'} exact={true} element={<Register />} />
            <Route path={'/cart'} exact={true} element={<CartPage />} />
            <Route path={'/verify'} exact={true} element={<Verify />} />
            <Route path={'/forgot-password'} exact={true} element={<ForgotPassword />} />
            <Route path={'/checkout'} exact={true} element={<Checkout />} />
            <Route path={'/my-account'} exact={true} element={<MyAccount />} />
            <Route path={'/my-list'} exact={true} element={<MyList />} />
            <Route path={'/my-orders'} exact={true} element={<Orders />} />
            <Route path={'/address'} exact={true} element={<Address />} />
          </Routes>
          <Footer />
        </MyContext.Provider>
      </BrowserRouter>

      <Dialog
        open={openProductDetailsModal.open}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        onClose={handleCloseProductDetailsModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="productDetailsModal"
      >
        <DialogContent>
          <div className="flex items-center w-full productDetailsModalContainer relative">
            <Button
              className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] 
            !absolute top-[15px] right-[15px] !bg-[#f1f1f1]"
            >
              <IoCloseSharp className="text-[20px]" onClick={handleCloseProductDetailsModal} />
            </Button>
            {openProductDetailsModal?.item?.length !== 0 && (
              <>
                <div className="col1 w-[40%] px-3 py-8">
                  <ProductZoom images={openProductDetailsModal?.item?.images} />
                </div>
                <div className="col2 w-[60%] py-8 px-8 pr-16 productContainer">
                  <ProductDetailsComponent item={openProductDetailsModal?.item} />
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  );
}

export default App;

export { MyContext };
