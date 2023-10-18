'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

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

    setGenres(data?.genres as IGenre[])
  }

  useEffect(() => {
    getGenres()
  }, [])

  return (
    <section className="flex flex-wrap gap-4">
      {genres.map(({ id, name }) => (
        <Link
          key={name}
          href={`/genres/${name}`}
        >
          <button className="group px-8 py-2 bg-black/70 border border-stone-700 rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-600 transition-colors">
            <h3 className="text-white/80 group-hover:text-white transition-colors">{name}</h3>
          </button>
        </Link>
      ))}
    </section>
  )
}

const responsive = {
  xxxxl: {
    breakpoint: { max: 3440, min: 2093 },
    items: 8,
    slidesToSlide: 8,
    partialVisibilityGutter: 16
  },
  xxxl: {
    breakpoint: { max: 2092, min: 1921 },
    items: 7,
    slidesToSlide: 7,
    partialVisibilityGutter: 16
  },
  xxl: {
    breakpoint: { max: 1920, min: 1581 },
    items: 6,
    slidesToSlide: 6,
    partialVisibilityGutter: 16
  },
  xl: {
    breakpoint: { max: 1580, min: 1361 },
    items: 5,
    slidesToSlide: 5,
    partialVisibilityGutter: 16
  },
  lg: {
    breakpoint: { max: 1420, min: 1093 },
    items: 4,
    slidesToSlide: 4,
    partialVisibilityGutter: 16
  },
  md: {
    breakpoint: { max: 1092, min: 813 },
    items: 3,
    slidesToSlide: 3,
    partialVisibilityGutter: 12
  },
  sm: {
    breakpoint: { max: 812, min: 499 },
    items: 2,
    slidesToSlide: 2,
    partialVisibilityGutter: 10
  },
  xs: {
    breakpoint: { max: 498, min: 275 },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 120
  }
}
