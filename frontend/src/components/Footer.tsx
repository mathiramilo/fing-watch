import Link from 'next/link'

const developers = [
  {
    name: 'Mathias Ramilo',
    linkedin: 'https://www.linkedin.com/in/mathias-ramilo/'
  },
  {
    name: 'Agustin Nuñez',
    linkedin: 'https://www.linkedin.com/in/agustin-nunez/'
  },
  {
    name: 'Roman Alvarez',
    linkedin: 'https://www.linkedin.com/in/roman-alvarez/'
  },
  {
    name: 'Nicolas Adrien',
    linkedin: 'https://www.linkedin.com/in/nicolas-adrien/'
  }
]

export default function Footer() {
  return (
    <footer className="relative w-full flex items-center">
      {/* Shadow */}
      <div className="absolute -z-[10] w-full h-64 sm:h-32 bottom-0 left-0 bg-black shadow-[0_-10px_120px_450px_rgba(0,0,0)] xl:shadow-[0_-10px_120px_260px_rgba(0,0,0)]"></div>

      {/* Footer */}
      <section className="z-10 w-full flex flex-col py-8 pt-32">
        <div className="w-full flex flex-col xl:flex-row xl:items-start gap-12 xl:gap-32 2xl:gap-48 3xl:gap-80 4xl:gap-96">
          {/* FingWatch and Fing logo */}
          <section className="flex flex-col items-start justify-center gap-4">
            <img
              src="/logo.png"
              alt="FingWatch Logo"
              width={190}
            />
            <img
              src="/logo-fing.png"
              alt="Fing logo"
              width={125}
            />
          </section>

          {/* Developers */}
          <section>
            <h4 className="text-white/80 font-bold mb-6 uppercase">Developers</h4>
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-y-3">
              {developers.map((developer, index) => (
                <Link
                  key={index}
                  href={developer.linkedin}
                  target="_blank"
                  className="text-white/60 hover:text-white/80 transition-colors"
                >
                  {developer.name}
                </Link>
              ))}
            </div>
          </section>

          {/* Project */}
          <section>
            <h4 className="text-white/80 font-bold mb-6 uppercase">Project</h4>

            <div className="grid grid-cols-2 xl:grid-cols-1 gap-y-3">
              <Link
                href="#"
                className="text-white/60 hover:text-white/80 transition-colors"
              >
                Github
              </Link>
              <Link
                href="#"
                className="text-white/60 hover:text-white/80 transition-colors"
              >
                Demo
              </Link>
              <Link
                href="#"
                className="text-white/60 hover:text-white/80 transition-colors"
              >
                Docs
              </Link>
            </div>
          </section>

          {/* Information */}
          <section className="xl:max-w-md 2xl:max-w-lg">
            <h4 className="text-white/80 font-bold mb-6 uppercase">Information</h4>

            <p className="text-white/60">
              FingWatch is a movie platform where you can discover the most popular and recent movies or search for the
              ones you desire. Additionally, for each movie, you can find a wealth of information such as the release
              year, duration, language, streaming platform availability, and similar movies. Finally, users have the
              opportunity to add movies to their watchlist and express their preferences by liking or disliking movies.
            </p>
          </section>
        </div>

        {/* Copyright */}
        <div className="w-full border-t border-t-white/20 mt-12 pt-3">
          <p className="text-white/50 text-xs text-start">&copy; FingWatch 2023. All Rights Reserved</p>
        </div>
      </section>
    </footer>
  )
}
