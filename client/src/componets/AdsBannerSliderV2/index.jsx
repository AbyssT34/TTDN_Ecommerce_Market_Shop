import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import BannerBox from '../BannerBox';
import BannerBoxV2 from '../bannerBoxV2';

const AdsBannerSlider = (props) => {
  return (
    <>
      <div className="py-5 w-full">
        <Swiper
          slidesPerView={props.items}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation]}
          className="smlBtn"
        >
          <SwiperSlide>
            <BannerBoxV2 info="left" image={'/bannerBox2.jpg'} link={'/'} />
          </SwiperSlide>

          <SwiperSlide>
            <BannerBoxV2 info="left" image={'/bannerBox2.jpg'} link={'/'} />
          </SwiperSlide>

          <SwiperSlide>
            <BannerBoxV2 info="left" image={'/bannerBox2.jpg'} link={'/'} />
          </SwiperSlide>

          <SwiperSlide>
            <BannerBoxV2 info="right" image={'/bannerBox1.jpg'} link={'/'} />
          </SwiperSlide>

          <SwiperSlide>
            <BannerBoxV2 info="right" image={'/bannerBox1.jpg'} link={'/'} />
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
};

export default AdsBannerSlider;
