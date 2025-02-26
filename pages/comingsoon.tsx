import Link from "next/link";


export default function ComingSoon() {
  return (
    <div className="flex flex-col bg-[#0A0A0A] text-white overflow-hidden min-h-screen">  

      {/* Main Content - Centered */}
      <div className="flex-grow flex items-center justify-center mt-20 sm:mt-24 md:mt-28">
        <div className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 text-center relative">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

          {/* Logo Clicável */}
          <Link href="/" className="flex items-center space-x-2 justify-center mb-6 sm:mb-8">
            <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-cyan-400 animate-pulseNeon">Z</span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">IGGLY</span>
          </Link>

          {/* Main Message */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 animate-pulseNeon relative z-10">
            Coming Soon
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-200 max-w-full sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto animate-fadeIn relative z-10">
            Something epic is on the horizon. Stay tuned for the ultimate token experience!
          </p>

          {/* Extra Flair */}
          <div className="mt-8 sm:mt-10 flex justify-center">
            <div className="bg-black/80 p-4 sm:p-6 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20">
              <p className="text-sm sm:text-base text-gray-400">
                Powered by <span className="text-purple-400 font-bold">Supra Chain</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 sm:p-8 md:p-10 text-center text-gray-400 bg-black border-t border-cyan-500/20">
        <p className="text-xs sm:text-sm md:text-base lg:text-lg">Ziggly | Powered by Supra Chain</p>
      </footer>
    </div>
  );
}