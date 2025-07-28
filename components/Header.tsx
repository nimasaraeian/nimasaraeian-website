"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black border-b border-gray-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="block">
            <Image
              src="/image/signature-white.png"
              alt="Nima Saraeian Signature"
              width={180}
              height={60}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
              Home
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
              About
            </Link>
            <Link href="/projects" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
              Projects
            </Link>
            <Link href="/articles" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
              Articles
            </Link>
            <Link href="/seminars" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
              Seminars
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 text-gray-300 hover:text-white transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black border-t border-gray-700">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg"
                style={{ fontFamily: 'Times New Roman, serif' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg"
                style={{ fontFamily: 'Times New Roman, serif' }}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/projects"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg"
                style={{ fontFamily: 'Times New Roman, serif' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/articles"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg"
                style={{ fontFamily: 'Times New Roman, serif' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Articles
              </Link>
              <Link
                href="/seminars"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg"
                style={{ fontFamily: 'Times New Roman, serif' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Seminars
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium text-lg"
                style={{ fontFamily: 'Times New Roman, serif' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
