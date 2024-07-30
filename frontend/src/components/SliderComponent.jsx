import React, {useState} from "react";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../assets/style/components/SliderComponent.css';
import MainFoodBanner_jeon from "../assets/images/MainFoodBanner_jeon.jpg"

export default function SliderComponent() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 2;

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (current) => setCurrentSlide(current)
    };
    return (
        <div className={"MainSlide"}>
            <SlickSlider {...settings}>
                <div className={"MainslideItem"}>
                    <img className={"MainslideItemImg"} src={MainFoodBanner_jeon} alt={"비오는 날엔 전이지"}/>
                    <h3 className={"MainslideItemTitle"}>비오는 날엔 전이지</h3>
                </div>
                <div className={"MainslideItem"}>
                    <img className={"MainslideItemImg"} src={MainFoodBanner_jeon} alt={"비오는 날엔 전이지"}/>
                    <span className={"MainslideItemTitle"}>비오는 날엔 전이지</span>
                </div>
            </SlickSlider>
            <div className="slider-counter">
                {currentSlide + 1} / {totalSlides}
            </div>
        </div>
    );
}
