'use client'

import { useState, useEffect } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { BiSearch } from 'react-icons/bi'
import { RxHamburgerMenu } from 'react-icons/rx'

import SideMenu from './SideMenu'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const handleScrollY = () => setScrollY(window.scrollY)

  useEffect(() => {
    window.addEventListener('scroll', handleScrollY)

    return () => window.removeEventListener('scroll', handleScrollY)
  }, [])

  return (
    <>
      {/* Side Menu */}
      <SideMenu
        open={menuOpen}
        setOpen={setMenuOpen}
      />

      {/* Navbar */}
      <section
        className={`w-full flex items-center justify-center fixed z-50 transition-colors ${
          scrollY > 0 && 'bg-black/75 backdrop-blur-sm'
        }`}
      >
        <div className="w-[90%] sm:w-full sm:px-12 flex items-center justify-between py-6">
          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <button onClick={() => setMenuOpen(true)}>
              <RxHamburgerMenu
                size="22"
                className="text-white/80 hover:text-white transition-colors"
              />
            </button>
            <Link
              href="/movies"
              className="text-white/80 font-bold hidden sm:block hover:text-white transition-colors"
            >
              Movies
            </Link>
            <Link
              href="/series"
              className="text-white/80 font-bold hidden sm:block hover:text-white transition-colors"
            >
              Series
            </Link>
          </nav>

          {/* Logo */}
          <Link
            href="/"
            className="absolute left-[50%] translate-x-[-50%] hidden md:block"
          >
            <Image
              src="/images/logo.png"
              alt="FingWatch Logo"
              width={190}
              height={190}
            />
          </Link>

          {/* Search & Session */}
          <div className="flex items-center gap-6">
            <Link href="/search">
              <BiSearch
                size={28}
                className="text-white/80 hover:text-white transition-colors"
              />
            </Link>
            <Link
              href="/sign-in"
              className="text-white/80 font-bold hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="bg-white/20 text-white/80 font-bold px-6 py-2 rounded-sm hover:bg-white/30 hover:text-white transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
