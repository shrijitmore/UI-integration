import React, { Fragment } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
// Import Swiper styles
// import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { EffectFade, Navigation, Pagination } from 'swiper'
function Newsticker () {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 9,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: 'linear'
  }
  return (
    <Fragment>
     
   
      <div className="container-fluid bg-white news-ticker">
        <div className="bg-white">
          <div className="best-ticker" >
            <div className="bn-news">
                <ul>
              <Slider {...settings}>
                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-users bg-danger-transparent text-danger mx-1"></span>
                  <span className="d-inline-block">Total Users</span>
                  <span className="bn-positive me-4">1,653</span>
                </li>

                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-signal bg-info-transparent text-info mx-1"></span>
                  <span className="d-inline-block">Total Leads</span>
                  <span className="bn-negative me-4">639</span>
                </li>

                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-briefcase bg-success-transparent text-success mx-1"></span>
                  <span className="d-inline-block"> Total Trials </span>
                  <span className="bn-negative me-4">12,765</span>
                  </li>

                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-trophy bg-warning-transparent text-warning mx-1"></span>
                  <span className="d-inline-block">Total Wins</span>
                  <span className="bn-positive me-4">24</span>
                  </li>

                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-envelope bg-primary-transparent text-primary mx-1"></span>
                  <span className="d-inline-block">Active Email Accounts</span>
                  <span className="bn-positive me-4">74,526</span>
                  </li>

                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-check-circle bg-danger-transparent text-danger mx-1"></span>
                  <span className="d-inline-block">Active Requests</span>
                  <span className="bn-positive me-4">14,526</span>
                  </li>

                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-envelope bg-secondary-transparent text-secondary mx-1"></span>
                  <span className="d-inline-block">Deactive Email Accounts</span>
                  <span className="bn-positive me-4">7,325 </span>
                </li>

                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-times-circle bg-info-transparent text-info mx-1"></span>
                  <span className="d-inline-block">Deactive Requests</span>
                  <span className="bn-positive me-4"> 1,425 </span>
                  </li>

                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-usd bg-success-transparent text-success mx-1"></span>
                  <span className="d-inline-block">Total Balance</span>
                  <span className="bn-negative me-4">$1,52,654</span>
                  </li>

                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-shopping-cart bg-danger-transparent text-danger mx-1"></span>
                  <span className="d-inline-block">Total Sales</span>
                  <span className="bn-negative me-4">23,15,2654</span>
                  </li>

                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-money bg-warning-transparent text-warning"></span>
                  <span className="d-inline-block">Total Purchase</span>
                  <span className="bn-positive me-4">$7,483</span>
                  </li>

                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-usd bg-danger-transparent text-danger mx-1"></span>
                  <span className="d-inline-block">Total Cost Reduction</span>
                  <span className="bn-negative me-4">$23,567</span>
                  </li>

                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-money bg-primary-transparent text-primary mx-1"></span>
                  <span className="d-inline-block">Total Cost Savings</span>
                  <span className="bn-negative me-4">15.2%</span>
                  </li>

                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-briefcase bg-info-transparent text-info mx-1"></span>
                  <span className="d-inline-block">Total Projects</span>
                  <span className="bn-positive me-4">3,456</span>
                  </li>

                <li className="text-muted fs-13 fw-semibold">
                  <span className="fa fa-users bg-success-transparent text-success mx-1"></span>
                  <span className="d-inline-block">Total Employes</span>
                  <span className="bn-positive me-4">4,738</span>
                  </li>
                  </Slider> 
                  </ul>
            </div>
          </div>
        </div>
      </div>
   

    </Fragment>
  )
}

export default Newsticker

