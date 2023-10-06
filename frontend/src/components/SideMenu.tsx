import Link from 'next/link'

import { IoMdClose } from 'react-icons/io'

import { Divider } from '@mui/material'

interface SideMenuProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function SideMenu({ open, setOpen }: SideMenuProps) {
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false)

    return
  }

  return (
    <div
      onClick={handleClose}
      className={`${
        !open && 'opacity-0 pointer-events-none'
      } fixed z-[100] w-full h-screen bg-black/50 backdrop-blur-sm transition-all duration-300`}
    >
      <div
        className={`${
          !open && '-translate-x-80'
        } flex flex-col gap-5 bg-neutral-900 px-8 py-5 h-screen w-full shadow-2xl md:w-80 transition-transform`}
      >
        <button
          onClick={() => setOpen(false)}
          className="text-start text-white/80 hover:text-white transition-colors"
        >
          <IoMdClose
            size={26}
            className="-translate-x-1"
          />
        </button>
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-lg text-white/80 hover:text-white transition-colors"
        >
          Home
        </Link>
        <Link
          href="/movies"
          onClick={() => setOpen(false)}
          className="text-lg text-white/80 hover:text-white transition-colors"
        >
          Movies
        </Link>
        <Link
          href="/series"
          onClick={() => setOpen(false)}
          className="text-lg text-white/80 hover:text-white transition-colors"
        >
          Series
        </Link>
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-lg text-white/80 hover:text-white transition-colors"
        >
          Trending Now
        </Link>
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-lg text-white/80 hover:text-white transition-colors"
        >
          Coming Soon
        </Link>

        <Divider color="#393939" />

        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-lg text-white/80 hover:text-white transition-colors"
        >
          My List
        </Link>
      </div>
    </div>
  )
}
