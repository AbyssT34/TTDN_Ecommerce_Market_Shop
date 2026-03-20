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
          {props?.data?.map((item, index) => {
            return (
              <SwiperSlide>
                <BannerBoxV2
                  info={item?.alignInfo}
                  item={item}
                  image={item?.images[0]}
                  link={'/'}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
};

export default AdsBannerSlider;
