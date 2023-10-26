'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { IGenre } from '@/types'
import { getGenres } from '@/services/genres'

import CustomSlider from './CustomSlider'

export default function GenresSlider() {
  const [genres, setGenres] = useState<IGenre[]>([])

  const fetchGenres = async () => {
    try {
      const data = await getGenres()

      setGenres(data as IGenre[])
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  useEffect(() => {
    fetchGenres()
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
