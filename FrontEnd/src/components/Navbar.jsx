import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ user, setUser }) {
  const [isOpen, setIsOpen] = useState(false);

  const logOut = () => {
    localStorage.clear();
    setUser({});
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Desktop Pill Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block">
        <div className="bg-black backdrop-blur rounded-full shadow-lg border border-white/20 px-1 py-0">
          <div className="flex items-center space-x-1">
            {/* Logo/Brand */}
            <div className="px-2 py-2 flex items-center">
              <div className="w-10 h-8 bg-white rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>

            {/* Navigation Links */}
            <Link
              to="/"
              className="px-6 py-2 bg-white text-black hover:text-white font-bold rounded-full hover:bg-black transition-all duration-200"
            >
              HOME
            </Link>

            {user.email ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-6 py-2 bg-white text-black hover:text-black font-bold rounded-full hover:bg-white transition-all duration-200"
                >
                  DASHBOARD
                </Link>
                <a
                  href="/textEditor.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-white text-black hover:text-black font-bold rounded-full hover:bg-white transition-all duration-200"
                >
                  UPLOAD AUDIO
                </a>
                <button
                  onClick={logOut}
                  className="px-6 py-2 text-red-600 bg-white hover:text-red-700 font-bold rounded-full hover:bg-red-50 transition-all duration-200"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-white text-black hover:text-white font-bold rounded-full hover:bg-white/70 transition-all duration-200"
                >
                  REGISTER
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-800 transition-all duration-200"
                >
                  LOGIN
                </Link>
              </>
            )}
          </div>
        </div>

        {/* User indicator (if logged in) */}
        {/*{user.email && (
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/20 px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">{user.email}</span>
            </div>
          </div>
        )}*/}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-6 left-6 z-50 md:hidden w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/20 flex items-center justify-center"
      >
        <div className="w-6 h-6 flex flex-col items-center justify-center space-y-1">
          <div className={`w-4 h-0.5 bg-gray-800 rounded transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`w-4 h-0.5 bg-gray-800 rounded transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <div className={`w-4 h-0.5 bg-gray-800 rounded transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-lg shadow-2xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Mobile Header */}
        <div className="p-8 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">Navigation</span>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="p-6">
          <ul className="space-y-4">
            <li>
              <Link
                className="flex items-center px-4 py-3 text-gray-800 font-semibold hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                to="/"
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
            </li>

            {user.email ? (
              <>
                <li>
                  <Link
                    className="flex items-center px-4 py-3 bg-white text-black font-semibold hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a
                    className="flex items-center px-4 py-3 bg-white text-black font-semibold hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                    href="/textEditor.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Audio
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logOut();
                      setIsOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-all duration-200 focus:outline-none"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    LogOut
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    className="flex items-center px-4 py-3 text-gray-800 font-semibold hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                    to="/register"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center px-4 py-3 text-gray-800 font-semibold hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                    to="/login"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile User Info Section */}
        {user.email && (
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200/50 bg-gray-50/50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-800">{user.email}</p>
                <p className="text-xs text-gray-500">Signed in</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;



