
export default function TokenScanner() {
  return (
    <div className="flex flex-col bg-[#0A0A0A] text-white overflow-hidden min-h-screen">   

      {/* Main Content - Centered */}
      <div className="mt-20 sm:mt-24 md:mt-28 flex-grow">
        {/* Header Section */}
        <header className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 bg-black relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>         
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 animate-pulseNeon relative z-10">
            Token Scanner
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-200 text-center max-w-full sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto animate-fadeIn relative z-10">
            Scan any token, feel the vibe—exclusive Ziggly edge!
          </p>
          {/* Address Input Placeholder */}
          <div className="mt-6 sm:mt-8 max-w-full sm:max-w-md md:max-w-lg mx-auto relative z-10">
            <input
              type="text"
              placeholder="Enter Token Address (e.g. 0x1234...)"
              className="w-full p-3 sm:p-4 bg-black/80 border border-cyan-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </header>

        {/* Scanner Result Section */}
        <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 bg-[#1a1a1a] relative">
          <div className="max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto">
            <div className="bg-black/80 p-4 sm:p-6 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-400 mb-4 sm:mb-6">Scan Result</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-sm sm:text-base text-gray-400">Name: <span className="text-white">Ziggly</span></p>
                  <p className="text-sm sm:text-base text-gray-400">Ticker: <span className="text-white">ZIG</span></p>
                  <p className="text-sm sm:text-base text-gray-400">Price: <span className="text-white">$0.50</span></p>
                  <p className="text-sm sm:text-base text-gray-400">24h Change: <span className="text-green-400">+4.2%</span></p>
                </div>
                <div>
                  <p className="text-sm sm:text-base text-gray-400">Liquidity: <span className="text-white">$250,000</span></p>
                  <p className="text-sm sm:text-base text-gray-400">Volume (24h): <span className="text-white">$75,000</span></p>
                  <p className="text-sm sm:text-base text-gray-400">Market Cap: <span className="text-white">$500,000</span></p>
                </div>
              </div>
              {/* Vibe Score Highlight */}
              <div className="mt-6 sm:mt-8 bg-black/90 p-4 sm:p-6 rounded-lg border border-purple-500/50 shadow-lg shadow-purple-500/20 text-center">
                <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400 mb-2 sm:mb-4">Vibe Score</h4>
                <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-400 animate-pulseNeon">87/100</p>
                <p className="mt-2 text-sm sm:text-base text-gray-400">This token’s got some serious buzz!</p>
              </div>
              <p className="mt-4 text-sm sm:text-base text-gray-400 text-center">
                Address: <span className="text-white">0x1234...</span>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="p-6 sm:p-8 md:p-10 text-center text-gray-400 bg-black border-t border-cyan-500/20">
        <p className="text-xs sm:text-sm md:text-base lg:text-lg">Ziggly | Powered by Supra Chain</p>
      </footer>
    </div>
  );
}