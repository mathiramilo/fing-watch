'use client'

import { useCallback, useRef } from 'react'

import { BiSearch } from 'react-icons/bi'
import { IoMdClose } from 'react-icons/io'

import { debounce } from '@/utils/debounce'

interface SearchBarProps {
  action: Function
}

export default function SearchBar({ action }: SearchBarProps) {
  const inputElem = useRef<HTMLInputElement>(null)

  const handleSearch = useCallback(
    debounce((inputValue: string) => action(inputValue), 500),
    []
  )

  const resetSearch = () => {
    if (inputElem.current) {
      inputElem.current.value = ''
      action('')
    }
  }

  return (
    <div className="relative group">
      <input
        type="text"
        ref={inputElem}
        onChange={() => handleSearch(inputElem.current?.value!)}
        placeholder="What are you looking for?"
        className="w-full p-4 pl-16 text-white/80 bg-neutral-800 rounded-sm border border-neutral-700 focus:outline-none focus:border-neutral-600 placeholder:text-white/30 transition-colors"
      />
      <BiSearch
        size={28}
        className="absolute top-1/2 -translate-y-[50%] left-5 text-white/30 group-focus-within:text-white/50 transition-colors"
      />
      <button
        onClick={resetSearch}
        className="absolute top-1/2 -translate-y-[50%] right-5"
      >
        <IoMdClose
          size={24}
          className={`${inputElem.current?.value !== '' && 'opacity-100'} text-white/80 opacity-0 transition-opacity`}
        />
      </button>
    </div>
  )
}
