'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

import { ENV } from '@/config'
import { IGenre } from '@/types'

export default function GenresSlider() {
  const [genres, setGenres] = useState<IGenre[]>([])

  const getGenres = async () => {
    const url = ENV.SERVER_API_URL + '/genres'

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    setGenres(data as IGenre[])
  }

  useEffect(() => {
    getGenres()
  }, [])

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
      {genres.map(({ id, name }) => (
        <Link
          key={id}
          href={`/genres/${name}`}
          className="mr-6"
        >
          <button className="group px-8 py-2 bg-black/70 border border-stone-700 rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-600 transition-colors">
            <h3 className="text-white/80 group-hover:text-white transition-colors">{name}</h3>
          </button>
        </Link>
      ))}
    </Slider>
  )
}

const CustomPrevArrow = ({ className, style, onClick }: any) => {
  return (
    <button
      onClick={() => onClick()}
      style={{ ...style }}
      className="group carousel-arrow-left absolute left-0 w-16 h-full flex items-center justify-center cursor-pointer bg-black/5 shadow-[5px_0_12px_5px_rgba(0,0,0,0.05)] hover:bg-black/25 transition-all duration-300"
    >
      <IoIosArrowBack
        size={32}
        className="text-white/60 group-hover:text-white/90 transition-all duration-300"
      />
    </button>
  )
}

const CustomNextArrow = ({ className, style, onClick }: any) => {
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
