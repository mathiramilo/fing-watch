'use client'

import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

interface CustomCarouselProps {
  responsive: any
  children: React.ReactNode
}

export default function CustomCarousel({ responsive, children }: CustomCarouselProps) {
  return (
    <Carousel
      responsive={responsive}
      autoPlay={false}
      swipeable={true}
      draggable={true}
      showDots={false}
      infinite={false}
      rewind={true}
      partialVisible={true}
      customLeftArrow={<CustomLeftArrow />}
      customRightArrow={<CustomRightArrow />}
      containerClass="carousel-container"
      itemClass="carousel-item pr-5"
    >
      {children}
    </Carousel>
  )
}

const CustomLeftArrow = ({ onClick }: any) => {
  return (
    <button
      onClick={() => onClick()}
      className="group carousel-arrow-left absolute left-0 w-16 h-full flex items-center justify-center cursor-pointer bg-black/5 shadow-[5px_0_12px_5px_rgba(0,0,0,0.05)] hover:bg-black/25 transition-all duration-300"
    >
      <IoIosArrowBack
        size={32}
        className="text-white/60 group-hover:text-white/90 transition-all duration-300"
      />
    </button>
  )
}

const CustomRightArrow = ({ onClick }: any) => {
  return (
    <button
      onClick={() => onClick()}
      className="group carousel-arrow-right absolute right-0 w-16 h-full flex items-center justify-center cursor-pointer bg-black/5 shadow-[-5px_0_12px_5px_rgba(0,0,0,0.05)] hover:bg-black/25 transition-all duration-300"
    >
      <IoIosArrowForward
        size={32}
        className="text-white/60 group-hover:text-white/90 transition-all duration-300"
      />
    </button>
  )
}
