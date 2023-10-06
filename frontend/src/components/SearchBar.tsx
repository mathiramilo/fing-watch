import { BiSearch } from 'react-icons/bi'
import { IoMdClose } from 'react-icons/io'

interface SearchBarProps {
  value: string
  setValue: (value: string) => void
}

export default function SearchBar({ value, setValue }: SearchBarProps) {
  return (
    <div className="relative group">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What are you looking for?"
        className="w-full p-4 pl-16 text-white/80 bg-neutral-800 rounded-sm border border-neutral-700 focus:outline-none focus:border-neutral-600 placeholder:text-white/30 transition-colors"
      />
      <BiSearch
        size={28}
        className="absolute top-1/2 -translate-y-[50%] left-5 text-white/30 group-focus-within:text-white/50 transition-colors"
      />
      <button
        onClick={() => setValue('')}
        className="absolute top-1/2 -translate-y-[50%] right-5"
      >
        <IoMdClose
          size={24}
          className={`${value !== '' && 'opacity-100'} text-white/80 opacity-0 transition-opacity`}
        />
      </button>
    </div>
  )
}
