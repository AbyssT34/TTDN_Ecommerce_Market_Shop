import React, { useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import ProductZoom from '../../componets/ProductZoom';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ProductsSlider from '../../componets/ProductsSlider';
import ProductDetailsComponent from '../../componets/ProductDetails';

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className="py-5">
        <div className="container">
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              href="/"
              className="link transition !text-[14px]"
            >
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="/"
              className="link transition !text-[14px]"
            >
              Fashion
            </Link>
            <Link underline="hover" color="inherit" className="link transition !text-[14px]">
              Cropperd Satin Bomber Jacket
            </Link>
          </Breadcrumbs>
        </div>
      </div>
      <section className="bg-white py-5">
        <div className="container flex gap-8 items-center">
          <div className="productZoomContainer w-[40%]">
            <ProductZoom />
          </div>

          <div className="productContainer w-[60%] pr-10 pl-10">
            <ProductDetailsComponent />
          </div>
        </div>

        <div className="container pt-10">
          <div className="flex items-center gap-8 mb-5">
            <span
              className={`link text-[17px] cursor-pointer font-[500] ${
                activeTab === 0 && 'text-primary'
              }`}
              onClick={() => setActiveTab(0)}
            >
              Description
            </span>
            <span
              className={`link text-[17px] cursor-pointer font-[500] ${
                activeTab === 1 && 'text-primary'
              }`}
              onClick={() => setActiveTab(1)}
            >
              Product Details
            </span>
            <span
              className={`link text-[17px] cursor-pointer font-[500] ${
                activeTab === 2 && 'text-primary'
              }`}
              onClick={() => setActiveTab(2)}
            >
              Reviews (5)
            </span>
          </div>
          {activeTab === 0 && (
            <>
              {' '}
              <div className="shadow-md w-full py-5 px-8 rounded-md">
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                  unknown printer took a galley of type and scrambled it to make a type specimen
                  book.
                </p>

                <h4>Lightweight Design</h4>

                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                  unknown printer took a galley of type and scrambled it to make a type specimen
                  book.
                </p>

                <h4>Free Shipping & Return</h4>

                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>

                <h4>Money Back Guarantee</h4>

                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>

                <h4>Online Support</h4>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </>
          )}

          {activeTab === 1 && (
            <>
              <div class="relative overflow-x-auto mt-5">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        Stand Up
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Folded(w/o wheels)
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Folded(w/ wheels)
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Door Pass Through
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-white border-b  border-gray-200">
                      <td class="px-6 py-4 font-[500]">35"Lx24"Wx37-45"H(font to back wheel)</td>
                      <td class="px-6 py-4 font-[500]">32.5"Lx18.5"Wx16.5"H</td>
                      <td class="px-6 py-4 font-[500]">32.5"Lx24"Wx18.5"H</td>
                      <td class="px-6 py-4 font-[500]">24</td>
                    </tr>
                    <tr class="bg-white border-b  border-gray-200">
                      <td class="px-6 py-4 font-[500]">35"Lx24"Wx37-45"H(font to back wheel)</td>
                      <td class="px-6 py-4 font-[500]">32.5"Lx18.5"Wx16.5"H</td>
                      <td class="px-6 py-4 font-[500]">32.5"Lx24"Wx18.5"H</td>
                      <td class="px-6 py-4 font-[500]">24</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 2 && (
            <>
              <div className="shadow-md w-[80%] py-5 px-8 rounded-md">
                <div className="w-full productReviewsContainer ">
                  <h2 className="text-[18px]">Customer questions & answers</h2>

                  <div className="reviewScroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden mt-5 pr-5">
                    <div className="review pb-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between">
                      <div className="info w-[60%] flex items-center gap-3">
                        <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                          <img src="/user.jpg" className="w-full" />
                        </div>

                        <div className="w-[80%]">
                          <h4 className="text-[16px]">Vịnh Trần</h4>
                          <h5 className="text-[13px] mb-0">2025-8-19</h5>
                          <p className="mt-0 mb-0">Nice Product</p>
                        </div>
                      </div>
                      <Rating name="size-small" defaultValue={4} readOnly />
                    </div>

                    <div className="review pb-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between">
                      <div className="info w-[60%] flex items-center gap-3">
                        <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                          <img src="/user.jpg" className="w-full" />
                        </div>

                        <div className="w-[80%]">
                          <h4 className="text-[16px]">Vịnh Trần</h4>
                          <h5 className="text-[13px] mb-0">2025-8-19</h5>
                          <p className="mt-0 mb-0">Nice Product</p>
                        </div>
                      </div>
                      <Rating name="size-small" defaultValue={4} readOnly />
                    </div>

                    <div className="review pb-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between">
                      <div className="info w-[60%] flex items-center gap-3">
                        <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                          <img src="/user.jpg" className="w-full" />
                        </div>

                        <div className="w-[80%]">
                          <h4 className="text-[16px]">Vịnh Trần</h4>
                          <h5 className="text-[13px] mb-0">2025-8-19</h5>
                          <p className="mt-0 mb-0">Nice Product</p>
                        </div>
                      </div>
                      <Rating name="size-small" defaultValue={4} readOnly />
                    </div>
                  </div>

                  <br />

                  <div className="reviewFrom bg-[#fafafa] p-4 rounded-md ">
                    <h2 className="text-[18px]">Add a review</h2>

                    <form className="w-full mt-5">
                      <TextField
                        id="outlined-multiline-flexible"
                        label="Multiline"
                        className="w-full mb-5"
                        multiline
                        rows={5}
                      />
                      <br /> <br />
                      <Rating name="size-small" defaultValue={4} />
                      <div className="flex items-center mt-5">
                        <Button className="bg-org">Submit Review</Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="container pt-8">
          <h2 className="text-[20px] font-[600] pb-0">Related Products</h2>
          <ProductsSlider items={6} />
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
