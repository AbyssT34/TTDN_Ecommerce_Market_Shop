import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import ProductsItem from '../ProductsItem';
import { Navigation } from 'swiper/modules';
// import required modules

const ProductsSlider = (props) => {
  return (
    <>
      <div className="productsSlider py-3">
        <Swiper
          slidesPerView={props.items}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
        >
          <SwiperSlide>
            <ProductsItem />
          </SwiperSlide>

          <SwiperSlide>
            <ProductsItem />
          </SwiperSlide>

          <SwiperSlide>
            <ProductsItem />
          </SwiperSlide>

          <SwiperSlide>
            <ProductsItem />
          </SwiperSlide>

          <SwiperSlide>
            <ProductsItem />
          </SwiperSlide>

          <SwiperSlide>
            <ProductsItem />
          </SwiperSlide>

          <SwiperSlide>
            <ProductsItem />
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
};

export default ProductsSlider;
