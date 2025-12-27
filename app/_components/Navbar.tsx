"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const isLoggedIn = false; // TODO: Replace with actual auth check

  return (
    <nav className="w-full bg-[#2C2C2C] flex items-center justify-between px-6 py-4 h-16">
      {/* Left Section - Logo */}
      <div className="flex items-center flex-shrink-0">
        <div className="bg-[#8B0000] px-4 py-3 flex items-center gap-2 h-full">
          <Image
            src="/images/logo.png"
            alt="CineGhar Logo"
            width={24}
            height={24}
            className="object-contain"
          />
          <span className="text-white font-sans text-lg font-semibold">
            CineGhar
          </span>
        </div>
      </div>

      {/* Middle Section - Navigation Links */}
      <div className="flex items-center gap-8 flex-1 justify-center">
        <Link
          href="/"
          className={`font-sans text-sm ${
            pathname === "/"
              ? "text-[#8B0000] border-b-2 border-[#8B0000] pb-1"
              : "text-white hover:text-gray-300"
          }`}
        >
          Home
        </Link>
        <Link
          href="/about"
          className="font-sans text-sm text-white hover:text-gray-300"
        >
          About Us
        </Link>
        <Link
          href="/movies"
          className="font-sans text-sm text-white hover:text-gray-300"
        >
          Movies
        </Link>
        <Link
          href="/contact"
          className="font-sans text-sm text-white hover:text-gray-300"
        >
          Contact
        </Link>
      </div>

      {/* Right Section - Search Bar and User/Auth */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search movies"
            className="bg-gray-300 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B0000] w-48"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10zM13 13l-3-3"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* User Avatar or Login/Signup Buttons */}
        {isLoggedIn ? (
          <div className="w-10 h-10 rounded-full bg-gray-400 overflow-hidden cursor-pointer">
            <Image
              src="/images/logo.png"
              alt="User avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-white font-sans text-sm hover:text-gray-300 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-[#8B0000] text-white font-sans text-sm rounded-lg hover:bg-[#6B0000] transition-colors"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

