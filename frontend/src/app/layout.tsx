import type { Metadata } from 'next'
import { Lato } from 'next/font/google'

import './globals.css'

import { Navbar } from '@/components'

const lato = Lato({ weight: ['100', '300', '400', '700', '900'], subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fing Watch • Movie Recommender',
  description: 'Find movies to watch according to your preferences and mood.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${lato.className} bg-gradient overflow-x-hidden`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
