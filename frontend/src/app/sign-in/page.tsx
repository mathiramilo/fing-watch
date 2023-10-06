import { AiOutlineGoogle } from 'react-icons/ai'
import { Divider } from '@mui/material'

import { Footer, IconButton } from '@/components'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <main className="w-[90%] mx-auto sm:w-full sm:px-12 pt-48">
      <h3 className="text-3xl font-bold text-center text-white/90 mb-16">Sign In</h3>

      <section className="w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-3xl p-10 rounded-md mb-20">
        <p className="text-white/80 mb-8">¿Tienes una cuenta de FingWatch?</p>

        {/* Sign In with Google */}
        <IconButton
          Icon={AiOutlineGoogle}
          text="Sign In with Google"
          iconSize={24}
          textSize="md"
          className="w-full bg-white/10 justify-center p-3 rounded-md mb-4 hover:bg-white/20 transition-colors"
        />

        <span className="block text-xs text-center text-white/50 mb-4">OR</span>

        {/* Sign In with Email and Password */}
        <form>
          <input
            type="email"
            className="w-full bg-white/10 text-white/80 border border-white/0 px-4 py-3 rounded-md mb-4 focus:outline-none focus:border-white/10 placeholder:text-white/40 transition-colors"
            placeholder="Email address"
          />
          <input
            type="password"
            className="w-full bg-white/10 text-white/80 border border-white/0 px-4 py-3 rounded-md mb-6 focus:outline-none focus:border-white/10 placeholder:text-white/40 transition-colors"
            placeholder="Password"
          />

          <button className="bg-white/10 text-white/80 font-bold px-12 py-3 rounded-md hover:bg-white/20 hover:text-white transition-colors">
            Sign In
          </button>
        </form>

        <Divider
          color="#3b3b3b"
          className="my-8"
        />

        <div className="flex items-center gap-4">
          <p className="text-white/80">¿Aún no tienes una cuenta?</p>
          <Link
            href="/sign-up"
            className="text-white/80 hover:text-white transition-colors"
          >
            Crear cuenta
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
