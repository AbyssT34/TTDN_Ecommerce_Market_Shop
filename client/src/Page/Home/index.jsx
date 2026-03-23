import React, { useState, useEffect } from 'react';
import HomeSlider from '../../componets/HomeSlider';
import HomeCatSlider from '../../componets/CatSlider';
import { LiaShippingFastSolid } from 'react-icons/lia';
import AdsBannerSlider from '../../componets/AdsBannerSlider';
import AdsBannerSliderV2 from '../../componets/AdsBannerSliderV2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ProductsSlider from '../../componets/ProductsSlider';
import { fetchDataFromApi } from '../../utils/api';

import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import BlogItem from '../../componets/BlogItem';
import HomeBannerV2 from '../../componets/HomeSliderV2';
import BannerBoxV2 from '../../componets/bannerBoxV2';
import { useContext } from 'react';
import { MyContext } from '../../App';
import ProductLoading from '../../componets/ProductLoading';

const Home = () => {
  const [value, setValue] = useState(0);
  const [homeSlidesData, setHomeSlidesData] = useState([]);
  const [popularproductsData, setPopularProducsData] = useState([]);
  const [productsData, setAllProductsData] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bannerV1Data, setBannerV1Data] = useState([]);
  const [blogData, setBlogData] = useState([]);

  const context = useContext(MyContext);

  useEffect(() => {
    fetchDataFromApi(`/api/homeSlider`).then((res) => {
      setHomeSlidesData(res?.data);
    });

    fetchDataFromApi(`/api/product/getAllProducts`).then((res) => {
      setAllProductsData(res?.products);
    });

    fetchDataFromApi(`/api/product/getAllFeaturedProducts`).then((res) => {
      setFeaturedProducts(res?.products);
    });

    fetchDataFromApi(`/api/bannerV1`).then((res) => {
      setBannerV1Data(res?.data);
    }); 

    fetchDataFromApi(`/api/blog`).then((res) => {
      setBlogData(res?.data);
    });
  }, []);

  useEffect(() => {
    fetchDataFromApi(`/api/product/getAllProductsByCatId/${context?.catData[0]?._id}`).then(
      (res) => {
        if (res?.error === false) {
          setPopularProducsData(res?.products);
        }
      }
    );
  }, [context?.catData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const filterByCatId = (id) => {
    setPopularProducsData([]);
    fetchDataFromApi(`/api/product/getAllProductsByCatId/${id}`).then((res) => {
      if (res?.error === false) {
        setPopularProducsData(res?.products);
      }
    });
  };

  return (
    <>
      {homeSlidesData?.length !== 0 && <HomeSlider data={homeSlidesData} />}

      {context?.catData?.length !== 0 && <HomeCatSlider data={context?.catData} />}

      <section className="bg-white py-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="leftSec">
              <h2 className="text-[20px] font-[600]">Popular Products</h2>
              <p className="text-[14px] font-[400] mt-0 mb-0">
                Do not miss the current offers until the end of March.
              </p>
            </div>

            <div className="rightSec w-[60%]">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                {context?.catData?.length !== 0 &&
                  context?.catData?.map((cat, index) => {
                    return <Tab label={cat?.name} onClick={() => filterByCatId(cat?._id)} />;
                  })}
              </Tabs>
            </div>
          </div>

          {popularproductsData?.length === 0 && <ProductLoading />}

          {popularproductsData?.length !== 0 && (
            <ProductsSlider items={6} data={popularproductsData} />
          )}
        </div>
      </section>

      <section className="py-6">
        <div className="container flex items-center gap-5">
          <div className="part1 w-[70%]">
            {productsData?.length !== 0 && <HomeBannerV2 data={productsData} />}
          </div>

          <div className="part2 w-[30%] flex items-center gap-5 justify-between flex-col">
            <BannerBoxV2 info="left" image={'/bannerBox2.jpg'} />
            <BannerBoxV2 info="right" image={'/bannerBox1.jpg'} />
          </div>
        </div>
      </section>

      <section className="py-4 pt-2 bg-white">
        <div className="container">
          <div
            className="freeShipping  w-[80%] m-auto py-4 p-4 border border-[#b92727] flex 
          items-center justify-between rounded-md mb-7"
          >
            <div className="col1 flex items-center gap-4 ">
              <LiaShippingFastSolid className="text-[50px] " />
              <span className="text-[20px] font-[600] uppercase">Free Shipping</span>
            </div>

            <div className="col2">
              <p className="mb-0 font-[500]">Free Delivery Now On Your First Order and over $200</p>
            </div>

            <p className="font-bold text-[25px]"> - Only $200*</p>
          </div>

          {bannerV1Data?.length !== 0 && <AdsBannerSliderV2 items={4} data={bannerV1Data} />}
        </div>
      </section>

      <section className="py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="text-[20px] font-[600]">Latest Products</h2>

          {productsData?.length === 0 && <ProductLoading />}
          {productsData?.length !== 0 && <ProductsSlider items={6} data={productsData} />}

          <AdsBannerSlider items={3} />
        </div>
      </section>

      <section className="py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="text-[20px] font-[600]">Featured Products</h2>
          {featuredProducts?.length !== 0 && <ProductsSlider items={6} data={featuredProducts} />}
          <AdsBannerSlider items={3} />
        </div>
      </section>

      {blogData?.length !== 0 && (
        <section className="py-5 pb-8 pt-0 bg-white blogSection">
          <div className="container">
            <h2 className="text-[20px] font-[600] mb-4">From The Blog</h2>
            <Swiper
              slidesPerView={4}
              spaceBetween={30}
              navigation={true}
              modules={[Navigation]}
              className="blogSlider"
            >
              {blogData?.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <BlogItem item={item}/>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
