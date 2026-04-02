import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { Button } from '@mui/material';
import { MyContext } from '../../App';
import { FaPlus } from 'react-icons/fa';
import Radio from '@mui/material/Radio';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { deleteData, fetchDataFromApi, postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const VITE_APP_STRIPE_ID = import.meta.env.VITE_APP_STRIPE_ID;
const VITE_APP_STRIPE_KEY_SECRET = import.meta.env.VITE_APP_STRIPE_KEY_SECRET;

const VITE_APP_PAYPAL_CLIENT_ID = import.meta.env.VITE_APP_PAYPAL_CLIENT_ID;
const VITE_API_URL = import.meta.env.VITE_API_URL || '';

const Checkout = () => {
  const [userData, setUserData] = useState(null);
  const [isChecked, setIsChecked] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentClientSecret, setPaymentClientSecret] = useState(null);
  const [paymentOrderPayload, setPaymentOrderPayload] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const context = useContext(MyContext);
  const histoty = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    setUserData(context?.userData);
    setSelectedAddress(context?.userData?.address_details?.[0]?._id || null);

    fetchDataFromApi(`/api/order/order-list`).then((res) => {
      console.log('User orders:', res);
    });
  }, [context?.userData, userData]);

  useEffect(() => {
    const numericTotal =
      context.cartData?.length !== 0
        ? context.cartData
            ?.map((item) => parseInt(item?.price) * item?.quantity)
            .reduce((total, value) => total + value, 0)
        : 0;

    setTotalAmount(numericTotal);

    localStorage.setItem('totalAmount', numericTotal.toString());
  }, [context?.cartData]);

  //paypal
  // Thay toàn bộ useEffect PayPal bằng đoạn này

  const paypalRendered = useRef(false); // thêm useRef ở đầu component

  useEffect(() => {
    if (!totalAmount || totalAmount <= 0) return;
    if (paypalRendered.current) return; // tránh render lại

    // Kiểm tra script đã load chưa
    const existingScript = document.querySelector(`script[src*="paypal.com/sdk/js"]`);

    const initPayPal = () => {
      const container = document.getElementById('paypal-button-container');
      if (!container) return;
      container.innerHTML = ''; // clear container trước khi render

      window.paypal
        .Buttons({
          createOrder: async () => {
            try {
              if (!totalAmount || totalAmount <= 0) throw new Error('Invalid total amount');

              let amountInUSD = 0;
              try {
                const resp = await fetch(
                  'https://v6.exchangerate-api.com/v6/d87ef6e24185a0fe30ad9d8f/latest/VND'
                );
                const respData = await resp.json();
                if (respData.result === 'success' && respData.conversion_rates?.USD) {
                  amountInUSD = parseFloat(
                    (totalAmount * respData.conversion_rates.USD).toFixed(2)
                  );
                } else throw new Error('Invalid exchange rate');
              } catch {
                amountInUSD = parseFloat((totalAmount / 24000).toFixed(2));
              }

              const token = localStorage.getItem('accesstoken');
              if (!token) throw new Error('No auth token');

              const response = await axios.get(
                `${VITE_API_URL}/api/order/create-order-paypal?userId=${context?.userData?._id}&totalAmount=${amountInUSD}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (!response?.data?.id) throw new Error('No order ID');
              return response.data.id;
            } catch (error) {
              console.error('PayPal createOrder error:', error);
              throw error;
            }
          },
          onApprove: async (data) => {
            onApprovePayment(data);
          },
          onError: (err) => {
            histoty('/orders/failed');
            console.error('PayPal onError:', err);
          },
        })
        .render('#paypal-button-container');

      paypalRendered.current = true;
    };

    if (existingScript) {
      // Script đã có, chỉ cần render
      if (window.paypal) {
        initPayPal();
      } else {
        existingScript.addEventListener('load', initPayPal);
      }
    } else {
      // Load script mới
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${VITE_APP_PAYPAL_CLIENT_ID}&disable-funding=card`;
      script.async = true;
      script.onload = initPayPal;
      document.body.appendChild(script);
    }
  }, [totalAmount]); // chỉ re-run khi totalAmount thay đổi

  const onApprovePayment = async (data) => {
    try {
      const userId = context?.userData?._id || localStorage.getItem('userId'); // ✅ fallback

      if (!userId) {
        context?.alertBox('error', 'User not found. Please log in again.');
        return;
      }

      const token = localStorage.getItem('accesstoken');
      if (!token) throw new Error('No authentication token');

      const info = {
        userId: userId, // ✅ dùng userId đã check
        products: context?.cartData,
        payment_status: 'COMPLETE',
        delivery_address: selectedAddress,
        totalAmount: totalAmount,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
      };

      const response = await axios.post(
        `${VITE_API_URL}/api/order/capture-order-paypal`,
        { ...info, paymentId: data.orderID },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        await deleteData(`/api/cart/emptyCart/${userId}`); // ✅ userId không còn undefined
        if (context?.getCartItems) await context.getCartItems();
        context?.alertBox('success', 'Order completed!');
        histoty('/orders/success');
      } else {
        context?.alertBox('error', 'Payment failed on server side.');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      context?.alertBox('error', 'Something went wrong during payment.');
    }
  };

  const editAddress = (id) => {
    context.setOpenAddressPanel(true);
    context.setAddressMode('edit');
    context.setAddressId(id);
  };

  const handleChange = (e, index) => {
    if (e.target.checked) {
      setIsChecked(index);
      setSelectedAddress(e.target.value);
    }
  };

  const checkout = async (e) => {
    e.preventDefault();
    const numericTotal =
      context?.cartData && context.cartData.length
        ? context.cartData.reduce(
            (sum, item) => sum + parseInt(item?.price || 0) * (item?.quantity || 1),
            0
          )
        : 0;

    try {
      // Request a PaymentIntent client secret from server
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || ''}/api/stripe/create-payment-intent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: numericTotal }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Create order payload with only JSON-serializable fields
      const cleanProducts = (context?.cartData || []).map((item) => ({
        productId: item?.productId || item?._id || item?.id || '',
        productTitle: item?.productTitle || item?.title || item?.name || '',
        quantity: parseInt(item?.quantity) || 1,
        price: parseInt(item?.price) || 0,
        image: item?.image || '',
      }));

      const orderPayload = {
        userId: context?.userData?._id,
        products: cleanProducts,
        paymentId: data.paymentIntentId || '',
        payment_status: 'PENDING',
        delivery_address: selectedAddress || null,
        totalAmt: numericTotal,
      };

      // Open payment modal with returned clientSecret
      setPaymentClientSecret(data.clientSecret);
      setPaymentOrderPayload(orderPayload);
      setShowPaymentModal(true);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Không thể khởi tạo thanh toán. Vui lòng thử lại.');
    }
  };

  const cashOnDeLivery = async (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      alert('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    const numericTotal =
      context?.cartData && context.cartData.length
        ? context.cartData.reduce(
            (sum, item) => sum + parseInt(item?.price || 0) * (item?.quantity || 1),
            0
          )
        : 0;

    try {
      // Create order payload with only JSON-serializable fields
      const cleanProducts = (context?.cartData || []).map((item) => ({
        productId: item?.productId || item?._id || item?.id || '',
        productTitle: item?.productTitle || item?.title || item?.name || '',
        quantity: parseInt(item?.quantity) || 1,
        price: parseInt(item?.price) || 0,
        image: item?.image || '',
      }));

      const codOrderPayload = {
        userId: context?.userData?._id,
        products: cleanProducts,
        paymentId: `COD_${Date.now()}`,
        payment_status: 'PENDING',
        delivery_address: selectedAddress,
        totalAmt: numericTotal,
      };

      // Create order directly (no payment needed for COD)
      const orderRes = await postData('/api/order/create', codOrderPayload);
      console.log('COD Order created:', orderRes);

      if (orderRes.success || orderRes.order) {
        alert('Đơn hàng tạo thành công! Thanh toán khi nhận hàng.');
        // Clear cart after successful order
        try {
          await deleteData(`/api/cart/emptyCart/${context?.userData?._id}`);
          context?.getCartItems();
          // Redirect to home
          histoty('/orders/success');
        } catch (cartErr) {
          console.error('Error clearing cart:', cartErr);
          // Still navigate even if cart clear fails
          histoty('/orders/failed');
        }
      } else {
        alert('Có lỗi tạo đơn hàng. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('COD checkout error:', err);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  // Stripe modal component
  const stripePromise = loadStripe(VITE_APP_STRIPE_ID);

  const PaymentModal = ({ clientSecret, onClose, orderPayload }) => {
    const options = { clientSecret };
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-md w-[420px]">
          <Elements stripe={stripePromise} options={options}>
            <InnerPaymentForm onClose={onClose} orderPayload={orderPayload} histoty={histoty} />
          </Elements>
        </div>
      </div>
    );
  };

  const InnerPaymentForm = ({ onClose, orderPayload }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmitPayment = async (ev) => {
      ev.preventDefault();
      if (!stripe || !elements) return;
      try {
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {},
          redirect: 'if_required',
        });

        if (error) {
          console.error('Payment confirmation error', error);
          alert(error.message || 'Payment failed');
        } else {
          // Payment successful - create order on server
          try {
            if (orderPayload) {
              const orderRes = await postData('/api/order/create', {
                ...orderPayload,
                payment_status: 'COMPLETED',
              });
              console.log('Order created:', orderRes);
              if (orderRes.success || orderRes.order) {
                alert('Thanh toán và tạo đơn hàng thành công!');
                // Clear cart after successful order
                try {
                  await deleteData(`/api/cart/emptyCart/${context?.userData?._id}`);
                  context?.getCartItems();
                  // Redirect to home
                  histoty('/orders/success');
                } catch (cartErr) {
                  console.error('Error clearing cart:', cartErr);
                  // Still navigate even if cart clear fails
                  histoty('/orders/failed');
                }
              } else {
                alert('Thanh toán thành công nhưng có lỗi tạo đơn hàng. Vui lòng liên hệ hỗ trợ.');
              }
            } else {
              alert('Thanh toán thành công');
            }
          } catch (orderErr) {
            console.error('Order creation error:', orderErr);
            alert('Thanh toán thành công nhưng có lỗi tạo đơn hàng');
          }
          onClose();
        }
      } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra');
      }
    };

    return (
      <form onSubmit={handleSubmitPayment}>
        <PaymentElement />
        <div className="flex gap-2 mt-4">
          <Button type="submit" className="bg-org btn-lg w-full">
            Pay
          </Button>
          <Button type="button" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  return (
    <>
      {showPaymentModal && paymentClientSecret && (
        <PaymentModal
          clientSecret={paymentClientSecret}
          orderPayload={paymentOrderPayload}
          histoty={histoty}
          onClose={() => {
            setShowPaymentModal(false);
            setPaymentClientSecret(null);
            setPaymentOrderPayload(null);
          }}
        />
      )}
      <section className="py-10">
        <form onSubmit={checkout}>
          <div className="w-[70%] m-auto flex gap-5">
            <div className="leftCol w-[60%]">
              <div className="card bg-white shadow-md p-5 rounded-md w-full">
                <div className="flex items-center justify-between">
                  <h2>Select Delivery Address</h2>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      context?.setOpenAddressPanel(true);
                      context?.setAddressMode('add');
                    }}
                  >
                    <FaPlus /> ADD NEW ADDRESS
                  </Button>
                </div>

                <br />

                <div className="flex flex-col gap-4">
                  {context?.userData?.address_details?.length !== 0 ? (
                    userData?.address_details?.map((address, index) => {
                      return (
                        <label
                          className={`flex gap-3 p-4 border border-[rgba(0,0,0,0.1)] rounded-md 
                          relative ${isChecked === index && 'bg-[#fff2f2]'} `}
                          key={index}
                        >
                          <div>
                            <Radio
                              size="small"
                              onChange={(e) => handleChange(e, index)}
                              checked={isChecked === index}
                              value={address?._id}
                            />
                          </div>
                          <div className="info">
                            <span className="inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md">
                              {address?.addressType}
                            </span>
                            <h3>{userData?.name}</h3>
                            <p className="mt-0 mb-0">
                              {address?.address_line1 +
                                ' ' +
                                address?.city +
                                ' ' +
                                address?.country +
                                ' ' +
                                address?.pincode +
                                ' ' +
                                address?.state +
                                ' ' +
                                address?.lamdmark}
                            </p>
                            <p className="mb-0 font-[500]">+{userData?.mobile}</p>
                          </div>

                          <Button
                            variant="text"
                            className="!absolute top-[15px] right-[15px] btn-sm"
                            size="small"
                            onClick={() => editAddress(address?._id)}
                          >
                            EDIT
                          </Button>
                        </label>
                      );
                    })
                  ) : (
                    <>
                      <div className="flex items-center mt-5 justify-between flex-col p-5">
                        <img src="/relocation.png" width="100" />
                        <h2 className="text-center">No Addresses found in your account</h2>
                        <p className="mt-0">Add a delivery address.</p>
                        <Button className="bg-org ">ADD ADDRESS</Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="rightCol w-[40%]">
              <div className="card shadow-md bg-white p-5 rounded-md">
                <h2 className="mb-4">Your Order</h2>

                <div className="flex items-center justify-between py-3 border-t border-b border-[rgba(0,0,0,0.1)]">
                  <span className="text-[14px] font-[600]">product</span>
                  <span className="text-[14px] font-[600]">Subtotal</span>
                </div>
                <div className="mb-5 scroll max-h-[300px] overflow-y-scroll overflow-x-hidden pr-2">
                  {context?.cartData?.length !== 0 &&
                    context?.cartData?.map((item, index) => {
                      return (
                        <>
                          <div className="flex items-center justify-between py-2" key={index}>
                            <div className="part1 flex items-center gap-3">
                              <div className="img w-[60px] h-[60px] object-cover overflow-hidden rounded-md group cursor-pointer">
                                <img
                                  src={item?.image}
                                  className="w-full transition-all group-hover:scale-105"
                                />
                              </div>

                              <div className="info">
                                <h4 className="text-[14px]" title={item?.productTitle}>
                                  {item?.productTitle?.substr(0, 20) + '...'}
                                </h4>
                                <span className="text-[13px]">Qty : {item?.quantity} </span>
                              </div>
                            </div>

                            <span className="text-[14px] font-[500]">
                              {' '}
                              {(item?.quantity * item?.price)?.toLocaleString('vi-VN', {
                                // Nên dùng 'vi-VN' để hiển thị định dạng số kiểu Việt Nam
                                style: 'currency',
                                currency: 'VND',
                                minimumFractionDigits: 0, // Loại bỏ phần .00 nếu không cần thiết
                              })}
                            </span>
                          </div>
                        </>
                      );
                    })}
                </div>
                <div className="flex items-center flex-col gap-3 mb-2">
                  <Button type="submit" className="bg-org btn-lg w-full flex gap-2">
                    <BsFillBagCheckFill className="text-[20px]" /> Checkout
                  </Button>
                  <div id="paypal-button-container"></div>
                  <Button
                    type="button"
                    className="bg-drack btn-lg w-full flex gap-2"
                    onClick={cashOnDeLivery}
                  >
                    <BsFillBagCheckFill className="text-[20px]" /> Cash On Delivery
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Checkout;
