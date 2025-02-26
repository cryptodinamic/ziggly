
import Link from "next/link";
import Image from "next/image";
//import { useTranslation } from "react-i18next";

export default function Home() {
  //const { t } = useTranslation(); // Ready for future translations

  return (
    <div className="flex flex-col bg-[#0A0A0A] text-white overflow-hidden">
      {/* Navigation - Fixed at Top */}
    

      {/* Main Content - Starts Below Navbar */}
      <div className="mt-20 sm:mt-24 md:mt-28"> {/* Added top margin to push content below fixed nav */}
        {/* Hero Section - Ziggly Hype */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-6rem)]">
          {/* Neon Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0033] via-[#00ffcc]/10 to-[#ff00cc]/10 animate-gradientShift"></div>
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            src="https://cdn.pixabay.com/video/2023/08/22/176786-856599135_tiny.mp4"
          />

          {/* Floating Ziggly Orbs */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full opacity-40 animate-orbit"
                style={{
                  width: `${Math.random() * 15 + 10}px`,
                  height: `${Math.random() * 15 + 10}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${Math.random() * 10 + 5}s`,
                }}
              />
            ))}
          </div>

          <Image
            src="ziggly.png" //
            alt="Ziggly Flutuante"
            width={230} // Ajuste o tamanho conforme necessário
            height={230}
            className="floating-ziggly"
          />

          

          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-10xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-600 animate-pulseNeon relative z-10">
            ZIGGLY
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-200 max-w-full sm:max-w-md md:max-w-xl lg:max-w-3xl animate-fadeIn relative z-10">
            The meme token that <span className="text-pink-400 font-bold">unlocks free tools </span> charts, portfolio, and more!<br></br>
          </p>
          
          <Link href="https://www.pumpit.pro/token/0x8bcb5e4c66a82dc794145d911c59cba5be86bfa2c38f3fd9d2d9fefb78e37495::PREZIGGLY::PREZIGGLY">
            <button className="mt-6 sm:mt-8 md:mt-10 px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold rounded-xl shadow-lg shadow-cyan-500/50 hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300 relative z-10">
              Buy Ziggly Now
            </button>
          </Link>

        
        </main>

        {/* Tools Section - Ziggly Utility */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-black relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-10 sm:mb-12 md:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 animate-slideUp">
            Unlock Ziggly Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto relative z-10">
            {/* Tool 1 - Token Charts */}
            <div>
              <Link href="/charts" className="block bg-[#1a1a1a] p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all duration-300 border border-cyan-500/30">
                <div className="w-full h-32 sm:h-40 md:h-48 lg:h-60 relative rounded-lg mb-4 sm:mb-6 animate-fadeIn">
                  <Image
                    src="https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=314,height=314,fit=cover,f=auto/262bd2a905aa0f575dc7756ebbaf562b.png"
                    alt="Token Charts"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-cyan-400">Token Charts</h4>
                <p className="text-gray-300 mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg">
                  Track any token’s price with real-time, ziggly-powered charts!
                </p>
              </Link>
            </div>

            {/* Tool 2 - Portfolio Tracker */}
            <div>
              <Link href="/portfolio-tracker" className="block bg-[#1a1a1a] p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all duration-300 border border-cyan-500/30">
                <div className="w-full h-32 sm:h-40 md:h-48 lg:h-60 relative rounded-lg mb-4 sm:mb-6 animate-fadeIn">
                  <Image
                    src="https://play-lh.googleusercontent.com/CiI-hgHVFXpAO4X5B1i5AXQ5SvqdHGbpAkIOm-l5tMGrpmkjJgtXA8SuCqF6zLNfWhs"
                    alt="Portfolio Tracker"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-pink-400">Portfolio Tracker</h4>
                <p className="text-gray-300 mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg">
                  See your crypto stash in one place—free with Ziggly!
                </p>
              </Link>
            </div>

            {/* Tool 3 - Market Vibes */}
            <div>
              <Link href="/vibes" className="block bg-[#1a1a1a] p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all duration-300 border border-cyan-500/30">
                <div className="w-full h-32 sm:h-40 md:h-48 lg:h-60 relative rounded-lg mb-4 sm:mb-6 animate-fadeIn">
                  <Image
                    src="https://bitcoinist.com/wp-content/uploads/2024/08/Picture18_704d57.jpg?fit=904%2C902"
                    alt="Market Vibes"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-400">Market Vibes</h4>
                <p className="text-gray-300 mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg">
                  Catch the hottest trends—Ziggly holders get the edge!
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Call-to-Action - Ziggly FOMO */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-r from-cyan-900/50 to-purple-900/50 text-center">
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 animate-pulse">
            Grab Ziggly Before It’s Gone!
          </h3>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-full sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto">
            The wildest meme token with tools you’ll actually use. Don’t sleep on this!
          </p>
          <Link href="https://www.pumpit.pro/token/0x8bcb5e4c66a82dc794145d911c59cba5be86bfa2c38f3fd9d2d9fefb78e37495::PREZIGGLY::PREZIGGLY">
            <button className="mt-6 sm:mt-8 md:mt-10 px-8 sm:px-10 md:px-12 lg:px-14 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl lg:text-2xl bg-pink-500 font-bold rounded-full shadow-lg shadow-pink-500/50 hover:bg-cyan-500 hover:shadow-cyan-500/50 transition-all duration-300">
              Get Ziggly Now!
            </button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="p-6 sm:p-8 md:p-10 text-center text-gray-400 bg-black border-t border-cyan-500/20">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg">Ziggly | From Meme to Mastery</p>
        </footer>
      </div>
    </div >
  );
}

