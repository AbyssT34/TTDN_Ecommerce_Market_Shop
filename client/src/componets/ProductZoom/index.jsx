import React, { useState } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const ProductZoom = () => {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [bigSwiper, setBigSwiper] = useState(null);
  const [smallSwiper, setSmallSwiper] = useState(null);

  const productImages = ['/product1.jpg', '/product2.jpg', '/product3.jpg'];

  const goto = (index) => {
    setSliderIndex(index);
    if (bigSwiper) {
      bigSwiper.slideTo(index);
    }
    if (smallSwiper) {
      smallSwiper.slideTo(index);
    }
  };

  return (
    <>
      <div className="flex gap-3">
        <div className="slider w-[15%] ">
          <Swiper
            onSwiper={setSmallSwiper}
            direction={'vertical'}
            slidesPerView={4}
            spaceBetween={0}
            navigation={true}
            modules={[Navigation]}
            className="zoomProductSliderThumbs h-[500px] overflow-hidden"
          >
            {productImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`item rounded-md overflow-hidden cursor-pointer group
                                 ${sliderIndex === index ? '' : 'opacity-30'}`}
                  onClick={() => goto(index)}
                >
                  <img src={image} className="w-full transition-all group-hover:scale-105" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="zoomContainer w-[85%] h-[500px] overflow-hidden rounded-md">
          <Swiper
            onSwiper={setBigSwiper}
            slidesPerView={1}
            spaceBetween={0}
            navigation={false}
            initialSlide={sliderIndex}
            onSlideChange={(swiper) => setSliderIndex(swiper.activeIndex)}
          >
            {productImages.map((image, index) => (
              <SwiperSlide key={index}>
                <InnerImageZoom zoomType="hover" zoomScale={1} src={image} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default ProductZoom;
