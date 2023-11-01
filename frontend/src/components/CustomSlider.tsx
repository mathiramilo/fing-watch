'use client'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

interface CustomSliderProps {
  children: React.ReactNode
}

export default function CustomSlider({ children }: CustomSliderProps) {
  return (
    <Slider
      className="slider variable-width"
      dots={false}
      infinite={false}
      draggable
      swipe
      slidesToShow={1}
      slidesToScroll={2}
      variableWidth
      nextArrow={<CustomNextArrow />}
      prevArrow={<CustomPrevArrow />}
      responsive={[
        {
          breakpoint: 4440,
          settings: {
            slidesToScroll: 4
          }
        },
        {
          breakpoint: 1480,
          settings: {
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToScroll: 2
          }
        }
      ]}
    >
      {children}
    </Slider>
  )
}

const CustomPrevArrow = ({ currentSlide, onClick }: any) => {
  const isDisabled = currentSlide === 0

  return (
    <div
      onClick={onClick}
      className={`${
        isDisabled && 'opacity-0 pointer-events-none'
      } hidden pointer-events-none sm:flex sm:pointer-events-auto group carousel-arrow-left absolute left-0 top-0 z-50 w-16 h-full items-center justify-center cursor-pointer bg-black/5 shadow-[5px_0_12px_5px_rgba(0,0,0,0.05)] hover:bg-black/25 transition-all duration-300`}
    >
      <IoIosArrowBack
        size={32}
        className="text-white/40 group-hover:text-white/90 transition-all duration-300"
      />
    </div>
  )
}

const CustomNextArrow = ({ currentSlide, slideCount, onClick }: any) => {
  const isDisabled = currentSlide === slideCount - 1

  return (
    <div
      onClick={onClick}
      className={`${
        isDisabled && 'opacity-0 pointer-events-none'
      } hidden pointer-events-none sm:flex sm:pointer-events-auto group carousel-arrow-right absolute right-0 top-0 w-16 h-full items-center justify-center cursor-pointer bg-black/5 shadow-[-5px_0_12px_5px_rgba(0,0,0,0.05)] hover:bg-black/25 transition-all duration-300`}
    >
      <IoIosArrowForward
        size={32}
        className="text-white/40 group-hover:text-white/90 transition-all duration-300"
      />
    </div>
  )
}
