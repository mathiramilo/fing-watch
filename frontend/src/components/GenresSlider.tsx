'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { ENV } from '@/config'
import { IGenre } from '@/types'

import CustomSlider from './CustomSlider'

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
    <CustomSlider>
      {genres.map(({ id, name }) => (
        <Link
          key={id}
          href={`/genres/${id}?name=${name}`}
          className="mr-6"
        >
          <button className="group px-8 py-2 bg-black/70 border border-stone-700 rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-600 transition-colors">
            <h3 className="text-white/80 group-hover:text-white transition-colors">{name}</h3>
          </button>
        </Link>
      ))}
    </CustomSlider>
  )
}
