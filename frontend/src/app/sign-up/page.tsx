'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { AiOutlineGoogle } from 'react-icons/ai'
import { BiError } from 'react-icons/bi'
import { Divider } from '@mui/material'

import { useAuth } from '@/hooks/useAuth'
import { signUp } from '@/services/auth'

import { Footer, IconButton } from '@/components'

export default function SignUpPage() {
  const { setToken } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const payload = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      repeatPassword: formData.get('repeatPassword') as string
    }

    if (!payload.email || !payload.password || !payload.repeatPassword) {
      setError('Please fill in all fields')
      setTimeout(() => setError(''), 10000)
      return
    }

    try {
      setLoading(true)

      const data = await signUp(payload.email, payload.password)

      if (data?.result) {
        setToken(data.token)
        router.push('/')
      }
    } catch (error) {
      setError((error as Error).message as string)
      setTimeout(() => setError(''), 10000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="w-[90%] mx-auto sm:w-full sm:px-12 pt-48">
      <h3 className="text-3xl font-bold text-center text-white/90 mb-16">Sign Up</h3>

      <section className="w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-3xl p-10 rounded-md mb-40">
        <p className="text-white/80 mb-8">Don&apos;t have a FingWatch account?</p>

        {/* Sign In with Google */}
        <IconButton
          Icon={AiOutlineGoogle}
          text="Sign Up with Google"
          iconSize={24}
          textSize="md"
          className="w-full bg-white/10 justify-center p-3 rounded-md mb-4 hover:bg-white/20 transition-colors"
        />

        <span className="block text-xs text-center text-white/50 mb-4">OR</span>

        {/* Sign In with Email and Password */}
        <form
          className="mb-8"
          onSubmit={handleSignUp}
        >
          <input
            type="email"
            name="email"
            className="w-full bg-white/10 text-white/80 border border-white/0 px-4 py-3 rounded-md mb-4 focus:outline-none focus:border-white/10 placeholder:text-white/40 transition-colors"
            placeholder="Email address"
          />
          <input
            type="password"
            name="password"
            className="w-full bg-white/10 text-white/80 border border-white/0 px-4 py-3 rounded-md mb-4 focus:outline-none focus:border-white/10 placeholder:text-white/40 transition-colors"
            placeholder="Password"
          />
          <input
            type="password"
            name="repeatPassword"
            className="w-full bg-white/10 text-white/80 border border-white/0 px-4 py-3 rounded-md mb-6 focus:outline-none focus:border-white/10 placeholder:text-white/40 transition-colors"
            placeholder="Repeat Password"
          />

          {/* Error */}
          {error && (
            <div className="w-full flex items-center gap-2 border border-red-600/60 rounded-md p-3 mb-6">
              <BiError
                size={20}
                className="text-red-600"
              />
              <span className="text-red-600">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-white/10 text-white/80 font-bold px-12 py-3 rounded-md hover:bg-white/20 hover:text-white transition-colors"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <Divider color="#3b3b3b" />

        <div className="flex items-center gap-4 mt-8">
          <p className="text-white/80">Already have an account?</p>
          <Link
            href="/sign-in"
            className="text-white/80 hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
