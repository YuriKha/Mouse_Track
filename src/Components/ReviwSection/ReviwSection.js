import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ReviwSection.css";
import "./ReviwCardStyle.css";
// import required modules
import {
  Autoplay,
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
} from "swiper/modules";
import { BsFillStarFill } from "react-icons/bs";
import { ReviewsData } from "./ReviewsData";

export default function ReviwSection() {
  return (
    <>
      <Swiper
        cssMode={true}
        navigation={true}
        pagination={true}
        mousewheel={true}
        keyboard={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Navigation, Pagination, Mousewheel, Keyboard]}
        className="mySwiper"
      >
        {ReviewsData.map((props, index) => {
          return (
            <SwiperSlide key={index}>
              <div className="container-review-card">
                <div className="review-card">
                  <p className="review-card-desc">"{props.Description}"</p>
                  <h2 className="review-card-author-name">{props.Author}</h2>
                  <div className="review-card-stars-icon">
                    <BsFillStarFill />
                    <BsFillStarFill />
                    <BsFillStarFill />
                    <BsFillStarFill />
                    <BsFillStarFill />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
