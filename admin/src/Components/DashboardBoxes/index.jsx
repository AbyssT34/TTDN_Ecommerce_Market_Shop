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

const DashboardBoxes = () => {
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
          <div className="box bg-white p-5 cursor-pointer hover:bg-[#fafafa] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <AiOutlineGift className="text-[40px] text-[#3872fa]" />
            <div className="info w-[70%]">
              <h3>Total Images</h3>
              <b>1.390</b>
            </div>
            <IoStatsChartSharp className="text-[50px] text-[#3872fa]" />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="box bg-white  p-5 cursor-pointer hover:bg-[#fafafa]  rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <AiTwotonePieChart className="text-[50px] text-[#10b981]" />
            <div className="info w-[70%]">
              <h3>Sales</h3>
              <b>$57,890</b>
            </div>
            <IoStatsChartSharp className="text-[40px] text-[#10b981]" />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="box bg-white p-5 cursor-pointer hover:bg-[#fafafa]  rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <BsBank className="text-[40px] text-[#7928ca]" />
            <div className="info w-[70%]">
              <h3>Revenue</h3>
              <b>1.390</b>
            </div>
            <IoStatsChartSharp className="text-[50px] text-[#7928ca]" />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="box bg-white p-5 cursor-pointer hover:bg-[#fafafa]  rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <SiProducthunt className="text-[40px] text-[#312be1d8]" />
            <div className="info w-[70%]">
              <h3>Total Products</h3>
              <b>1.390</b>
            </div>
            <IoStatsChartSharp className="text-[30px] text-[#312be1d8]" />
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default DashboardBoxes;
