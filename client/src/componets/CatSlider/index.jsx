import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

const HomeCatSlider = () => {
  return (
    <>
      <div className="homeCatSlider pt-4 py-8">
        <div className="container">
          <Swiper
            slidesPerView={8}
            spaceBetween={10}
            navigation={true}
            modules={[Navigation]}
            className="homeCatSlider"
          >
            <SwiperSlide>
              <Link to={'/'}>
                <div className="item py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col ">
                  <img
                    src="/navImg/fashion.jpg"
                    alt="fashion"
                    className="w-[60px] transition-all"
                  />
                  <h3 className="text-[15px] font-[500] mt-3 ">Fashion</h3>
                </div>
              </Link>
            </SwiperSlide>

            <SwiperSlide>
              <Link to={'/'}>
                <div className="item py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col ">
                  <img
                    src="/navImg/Elctronics.png"
                    alt="Elctronics"
                    className="w-[60px] transition-all"
                  />
                  <h3 className="text-[15px] font-[500] mt-3 ">Elctronics</h3>
                </div>
              </Link>
            </SwiperSlide>

            <SwiperSlide>
              <Link to={'/'}>
                <div className="item py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col ">
                  <img src="/navImg/Bags1.jpg" alt="Bags" className="w-[60px] transition-all" />
                  <h3 className="text-[15px] font-[500] mt-3 ">Bags</h3>
                </div>
              </Link>
            </SwiperSlide>

            <SwiperSlide>
              <Link to={'/'}>
                <div className="item py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col ">
                  <img
                    src="/navImg/Footwear.svg"
                    alt="Footwear.svg"
                    className="w-[60px] transition-all"
                  />
                  <h3 className="text-[15px] font-[500] mt-3 ">Footwear</h3>
                </div>
              </Link>
            </SwiperSlide>

            <SwiperSlide>
              <Link to={'/'}>
                <div className="item py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col ">
                  <img
                    src="/navImg/Groceries.png"
                    alt="Groceries"
                    className="w-[60px] transition-all"
                  />
                  <h3 className="text-[15px] font-[500] mt-3 ">Groceries</h3>
                </div>
              </Link>
            </SwiperSlide>

            <SwiperSlide>
              <Link to={'/'}>
                <div className="item py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col ">
                  <img src="/navImg/Beauty.jpg" alt="Beauty" className="w-[60px] transition-all" />
                  <h3 className="text-[15px] font-[500] mt-3 ">Beauty</h3>
                </div>
              </Link>
            </SwiperSlide>

            <SwiperSlide>
              <Link to={'/'}>
                <div className="item py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col ">
                  <img
                    src="/navImg/Wellness1.jpg"
                    alt="Wellness"
                    className="w-[60px] transition-all"
                  />
                  <h3 className="text-[15px] font-[500] mt-3 ">Wellness</h3>
                </div>
              </Link>
            </SwiperSlide>

            <SwiperSlide>
              <Link to={'/'}>
                <div className="item py-7 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col ">
                  <img
                    src="/navImg/Jewellery.jpg"
                    alt="Jewellery"
                    className="w-[60px] transition-all"
                  />
                  <h3 className="text-[15px] font-[500] mt-3 ">Jewellery</h3>
                </div>
              </Link>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default HomeCatSlider;
