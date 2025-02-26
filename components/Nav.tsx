"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import dynamic from "next/dynamic";

const WalletConnector = dynamic(() => import("./WalletConnector"), { ssr: false });

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <header className="relative z-50">
      {/* Navbar for Desktop */}
      <nav className="hidden md:flex justify-between items-center px-6 py-4 bg-[#0A0A0A] backdrop-blur-lg border-b border-cyan-500/20 shadow-lg shadow-cyan-500/10 fixed top-0 left-0 right-0">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl font-extrabold text-cyan-400 animate-pulseNeon">Z</span>
            <span className="text-3xl font-extrabold text-white">IGGLY</span>
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <Link href="/" className="text-gray-300 hover:text-cyan-400 hover:glow-cyan transition-all duration-300">
            Home
          </Link>
          <Link href="/charts" className="text-gray-300 hover:text-cyan-400 hover:glow-cyan transition-all duration-300">
            Charts
          </Link>
          <Link href="/portfolio-tracker" className="text-gray-300 hover:text-cyan-400 hover:glow-cyan transition-all duration-300">
            Portfolio
          </Link>
          <Link href="/vibes" className="text-gray-300 hover:text-cyan-400 hover:glow-cyan transition-all duration-300">
            Ziggly Scanner
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <WalletConnector />
          <Link
            href="/comingsoon"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 text-sm md:text-base"
          >
            Join Community
          </Link>
        </div>
      </nav>

      {/* Navbar for Mobile */}
      <nav className="md:hidden flex justify-between items-center px-4 py-3 bg-[#0A0A0A] backdrop-blur-lg border-b border-cyan-500/20 shadow-lg shadow-cyan-500/10 fixed top-0 left-0 right-0">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold text-cyan-400 animate-pulseNeon">Z</span>
            <span className="text-2xl font-extrabold text-white">IGGLY</span>
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          className="p-2 text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full hover:scale-110 transition-all duration-300"
        >
          <FiMenu size={20} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col animate-slideIn">
          <div className="flex justify-between items-center p-4 border-b border-cyan-500/30">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold text-cyan-400 animate-pulseNeon">Z</span>
              <span className="text-2xl font-extrabold text-white">IGGLY</span>
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 text-cyan-400 hover:text-pink-400 hover:scale-110 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-8">
            <Link
              href="/"
              className="text-xl font-semibold text-gray-300 hover:text-cyan-400 hover:glow-cyan hover:scale-105 transition-all duration-300"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/charts"
              className="text-xl font-semibold text-gray-300 hover:text-cyan-400 hover:glow-cyan hover:scale-105 transition-all duration-300"
              onClick={toggleMenu}
            >
              Charts
            </Link>
            <Link
              href="/portfolio-tracker"
              className="text-xl font-semibold text-gray-300 hover:text-cyan-400 hover:glow-cyan hover:scale-105 transition-all duration-300"
              onClick={toggleMenu}
            >
              Portfolio
            </Link>
            <Link
              href="/vibes"
              className="text-xl font-semibold text-gray-300 hover:text-cyan-400 hover:glow-cyan hover:scale-105 transition-all duration-300"
              onClick={toggleMenu}
            >
              Ziggly Scanner
            </Link>
          </div>

          <div className="p-4 border-t border-cyan-500/30 flex flex-col items-center space-y-4">
            <WalletConnector />
            <Link
              href="https://t.me/ziggly_cto"
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-lg font-bold rounded-full hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 text-center"
              onClick={toggleMenu}
              target="_blank" // Isso abre o link em uma nova aba
              rel="noopener noreferrer" // Boa prática para segurança em links externos
            >
              Join Telegram
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}