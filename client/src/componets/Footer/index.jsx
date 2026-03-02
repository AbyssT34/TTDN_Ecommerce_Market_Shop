import React, { useContext } from 'react';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { PiKeyReturn } from 'react-icons/pi';
import { BsWallet2 } from 'react-icons/bs';
import { LiaGiftSolid } from 'react-icons/lia';
import { BiSupport } from 'react-icons/bi';
import { Link, Links } from 'react-router-dom';
import { MdChatBubbleOutline } from 'react-icons/md';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FaFacebookF } from 'react-icons/fa';
import { AiOutlineYoutube } from 'react-icons/ai';
import { FaPinterestP } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';

import Drawer from '@mui/material/Drawer';
import CartPanel from '../CartPanel';
import { MyContext } from '../../App';

const Footer = () => {
  const context = useContext(MyContext);

  return (
    <>
      <footer className="py-6 bg-[#fafafa]">
        <div className="container">
          <div className="flex items-center justify-center gap-2 py-8 pb-8">
            <div className="col flex items-center justify-center flex-col group w-[15%]">
              <LiaShippingFastSolid
                className="text-[40px] transition-all 
                    duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1"
              />
              <h3 className="text-[16px] font-[600] mt-3">Free Shipping</h3>
              <p className="text-[12px] font-[500]">For all Orders Over $100</p>
            </div>

            <div className="col flex items-center justify-center flex-col group w-[15%]">
              <PiKeyReturn
                className="text-[40px] transition-all 
                    duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1"
              />
              <h3 className="text-[16px] font-[600] mt-3">30 Days Returns</h3>
              <p className="text-[12px] font-[500]">For an Exchange Products</p>
            </div>

            <div className="col flex items-center justify-center flex-col group w-[15%]">
              <BsWallet2
                className="text-[40px] transition-all 
                    duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1"
              />
              <h3 className="text-[16px] font-[600] mt-3">Securde Payment</h3>
              <p className="text-[12px] font-[500]">Payment Cards Accepted</p>
            </div>

            <div className="col flex items-center justify-center flex-col group w-[15%]">
              <LiaGiftSolid
                className="text-[40px] transition-all 
                    duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1"
              />
              <h3 className="text-[16px] font-[600] mt-3">Special Gifts</h3>
              <p className="text-[12px] font-[500]">Our First Product Order</p>
            </div>

            <div className="col flex items-center justify-center flex-col group w-[15%]">
              <BiSupport
                className="text-[40px] transition-all 
                    duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1"
              />
              <h3 className="text-[16px] font-[600] mt-3">Shupport 24/7</h3>
              <p className="text-[12px] font-[500]">Contact us Anytime</p>
            </div>
          </div>
          <br />

          <hr />

          <div className="footer flex  py-8">
            <div className="part1 w-[25%] border-r border-[rgba(0,0,0,0.1)]">
              <h2 className="text-[18px] font-[600] mb-4">Contact us</h2>
              <p className="text-[13px] font-[400] pb-4">
                ECommerce-Shoping - Mega Super Store <br /> 507 -Union Trade Centre Việt Name{' '}
              </p>
              <Link className="link" to={'mailto:someone@example.com'}>
                quocvinhtran.0212@gmail.com
              </Link>
              <span className="text-[25px] font-[600] block w-full mt-3 mb-5 text-primary">
                (+84) 9465-65-316
              </span>

              <div className="flex items-center gap-2">
                <MdChatBubbleOutline className="text-[40px] text-primary" />
                <span className="text-[17px] font-[600]">
                  {' '}
                  Online Chat <br /> Get Expert Help
                </span>
              </div>
            </div>

            <div className="part2 w-[40%] flex pl-8">
              <div className="part2_col1 w-[50%]">
                <h2 className="text-[18px] font-[600] mb-4">Products</h2>

                <ul className="list">
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to={'/'} className="link">
                      Prices drop
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to={'/'} className="link">
                      New Products
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to={'/'} className="link">
                      Bet Sales
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to={'/'} className="link">
                      Contact Us
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to={'/'} className="link">
                      Sitemap
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to={'/'} className="link">
                      Stores
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="part2_col2 w-[50%]">
                <h2 className="text-[18px] font-[600] mb-4">Our Company</h2>

                <ul className="list">
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to={'/'} className="link">
                      Delivery
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to={'/'} className="link">
                      Legal Notice
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to={'/'} className="link">
                      Terms And Conditions Of Use
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to={'/'} className="link">
                      About Us
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to={'/'} className="link">
                      SecurePayment
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to={'/'} className="link">
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="part3 w-[35%] flex pl-8 flex-col pr-8">
              <h2 className="text-[18px] font-[600] mb-4">Subscribe To Newsletter</h2>
              <p className="text-[13px]">
                Subscribe to our latest newsletter to get news about special discounts.
              </p>
              <form className="mt-5">
                <input
                  type="text"
                  className="w-full h-[45px] border outline-none pl-4 pr-4 
                        rounded-sm mb-4 focus:border-[rgba(0,0,0,0.3)]"
                  placeholder="Your Emaill Address"
                />
                <Button className="bg-org">SUBSCRIBE</Button>

                <FormControlLabel
                  control={<Checkbox />}
                  label="I agree to the terms and conditions and the privacy policy"
                />
              </form>
            </div>
          </div>
        </div>
      </footer>

      <div className="bottomStrip border-t border-[rgba(0,0,0,0.1)] py-3 bg-white">
        <div className="container flex items-center justify-between">
          <ul className="flex items-center gap-2">
            <li className="list-none">
              <Link
                to={'/'}
                target="_blank"
                className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] 
                 flex items-center justify-center group hover:bg-[#ff5252] transition-all"
              >
                <FaFacebookF className="text-[15px] group-hover:text-white" />
              </Link>
            </li>

            <li className="list-none">
              <Link
                to={'/'}
                target="_blank"
                className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] 
                 flex items-center justify-center group hover:bg-[#ff5252] transition-all"
              >
                <AiOutlineYoutube className="text-[15px] group-hover:text-white" />
              </Link>
            </li>

            <li className="list-none">
              <Link
                to={'/'}
                target="_blank"
                className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] 
                 flex items-center justify-center group hover:bg-[#ff5252] transition-all"
              >
                <FaPinterestP className="text-[15px] group-hover:text-white" />
              </Link>
            </li>

            <li className="list-none">
              <Link
                to={'/'}
                target="_blank"
                className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] 
                 flex items-center justify-center group hover:bg-[#ff5252] transition-all"
              >
                <FaInstagram className="text-[15px] group-hover:text-white" />
              </Link>
            </li>
          </ul>

          <p className="text-[13px] text-center">© 2024 - Ecommerce Template</p>

          <div className="flex items-center">
            <img src="/cart1.png" alt="cart" />
            <img src="/cart2.png" alt="cart" />
            <img src="/card3.png" alt="cart" />
            <img src="/card4.png" alt="cart" />
            <img src="/card5.png" alt="cart" />
          </div>
        </div>
      </div>

      <Drawer
        open={context.openCartPanel}
        onClose={context.toggleCartPanel(false)}
        anchor={'right'}
        className="cartPanel"
      >
        <div className="flex items-center justify-between py-3 px-4 gap-3 border-b border-[rgba(0,0,0,0.1)] overflow-hidden">
          <h4>Shopping Cart (1) </h4>
          <IoCloseSharp
            className="text-[20px] cursor-pointer"
            onClick={context.toggleCartPanel(false)}
          />
        </div>

        <CartPanel />
      </Drawer>
    </>
  );
};

export default Footer;
