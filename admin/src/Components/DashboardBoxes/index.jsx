import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { AiOutlineGift } from "react-icons/ai";
import { IoStatsChartSharp } from "react-icons/io5";
import { AiTwotonePieChart } from "react-icons/ai";
import { BsBank } from "react-icons/bs";
import { SiProducthunt } from "react-icons/si";

import { Navigation } from "swiper/modules";

const DashboardBoxes = (props) => {
  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="dashboadrBoxesSlider"
      >
        <SwiperSlide>
          <div className="box bg-[#10b981] p-5 cursor-pointer hover:bg-[#10b981] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <AiOutlineGift className="text-[40px] text-white" />
            <div className="info w-[70%]">
              <h3 className="text-white">Total Users</h3>
              <b className="text-white">{props?.users}</b>
            </div>
            <IoStatsChartSharp className="text-[50px] text-white" />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="box bg-[#3872fa]  p-5 cursor-pointer hover:bg-[#3872fa]  rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <AiTwotonePieChart className="text-[50px] text-white" />
            <div className="info w-[70%]">
              <h3 className="text-white">Total Orders</h3>
              <b className="text-white">{props?.orders}</b>
            </div>
            <IoStatsChartSharp className="text-[40px] text-white" />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="box bg-[#312be1d8] p-5 cursor-pointer hover:bg-[#312be1d8]  rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <SiProducthunt className="text-[40px] text-white" />
            <div className="info w-[70%]">
              <h3 className="text-white">Total Product</h3>
              <b className="text-white">{props?.products}</b>
            </div>
            <IoStatsChartSharp className="text-[50px] text-white" />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="box bg-[#f22c61] p-5 cursor-pointer hover:bg-[#f22c61]  rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <SiProducthunt className="text-[40px] text-white" />
            <div className="info w-[70%]">
              <h3 className="text-white">Total Category</h3>
              <b className="text-white"> {props?.categorry}</b>
            </div>
            <IoStatsChartSharp className="text-[30px] text-white" />
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default DashboardBoxes;
