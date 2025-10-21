import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
              <span className="text-lg font-bold text-white">CH</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Content Hub
            </span>
          </Link>
          
          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
            <Link to="/feeds" className="text-gray-700 hover:text-gray-900 font-medium">Explore</Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium">Contact</Link>
          </div>
          
          <div className="hidden md:flex gap-4">
            <Link to="/login" className="px-6 py-2 text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all">
              Sign Up
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fadeIn"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 md:hidden animate-slideInRight">
            <div className="p-6">
              <button 
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="mt-12 flex flex-col gap-4">
                <Link to="/" className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg text-center font-medium">
                  Home
                </Link>
                <Link to="/feeds" className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg text-center font-medium">
                  Explore
                </Link>
                <Link to="/contact" className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg text-center font-medium">
                  Contact
                </Link>
                <Link to="/login" className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all text-center">
                  Login
                </Link>
                <Link to="/signup" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-center">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
