'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import Link from 'next/link'

import { BiSearch, BiUserCircle } from 'react-icons/bi'
import { RxHamburgerMenu } from 'react-icons/rx'

import { useAuth } from '@/hooks/useAuth'

import SideMenu from './SideMenu'
import { Divider } from '@mui/material'

export default function Navbar() {
  const { user, setToken } = useAuth()

  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const profileMenuRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const handleScrollY = () => setScrollY(window.scrollY)

  const handleSignOut = () => {
    setToken(null)
    setProfileOpen(false)
    router.refresh()
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScrollY)
    return () => window.removeEventListener('scroll', handleScrollY)
  }, [])

  useEffect(() => {
    const handleWindowClick = (e: any) => {
      if (!profileMenuRef.current?.contains(e.target)) {
        setProfileOpen(false)
      }
    }

    window.addEventListener('mousedown', handleWindowClick)
    return () => window.removeEventListener('mousedown', handleWindowClick)
  })

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
              href="/"
              className="text-white/80 font-bold hidden sm:block hover:text-white transition-colors"
            >
              Movies
            </Link>
            <Link
              href="/"
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
            <img
              src="/logo.png"
              alt="FingWatch Logo"
              width={190}
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

            {user ? (
              <div className="relative">
                {/* User Avatar */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 flex justify-center items-center rounded-full bg-violet-950 border border-stone-700/60 text-lg font-bold uppercase"
                >
                  {user?.email?.[0]}
                </button>

                {/* Profile Menu */}
                <div
                  ref={profileMenuRef}
                  className={`${
                    !profileOpen && 'opacity-0 scale-95 -translate-y-3 translate-x-2 pointer-events-none'
                  } absolute top-12 right-0 bg-neutral-900 p-4 rounded-md min-w-[200px] flex flex-col gap-3 shadow-xl transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <BiUserCircle
                      size={36}
                      className="text-white/80"
                    />
                    <div>
                      <p className="text-white/90 font-bold mb-1">{user?.email}</p>
                      <p className="text-white/50 text-xs">Welcome!</p>
                    </div>
                  </div>
                  <Divider color="#5e5d5d" />
                  <Link
                    href="/profile"
                    className="text-start text-white/80 hover:text-white transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    My Watchlist
                  </Link>
                  <Link
                    href="/profile"
                    className="text-start text-white/80 hover:text-white transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/profile"
                    className="text-start text-white/80 hover:text-white transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <Divider color="#5e5d5d" />
                  <button
                    className="text-start text-white/80 hover:text-white transition-colors"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
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
            )}
          </div>
        </div>
      </section>
    </>
  )
}
