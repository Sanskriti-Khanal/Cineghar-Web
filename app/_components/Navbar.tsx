"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  // Only track sections on homepage
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      // Define sections with their IDs
      const sections = [
        { id: "home", offset: 0 },
        { id: "features", offset: 0 },
        { id: "movies", offset: 0 },
        { id: "categories", offset: 0 },
        { id: "cta", offset: 0 },
      ];

      // Calculate offsets
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          section.offset = element.offsetTop - 100; // 100px offset for navbar
        }
      });

      // Find active section
      let current = "home";
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].offset) {
          current = sections[i].id;
          break;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const navLinks = [
    { href: "/", label: "Home", section: "home" },
    { href: "/#features", label: "Features", section: "features" },
    { href: "/#movies", label: "Movies", section: "movies" },
    { href: "/#categories", label: "Categories", section: "categories" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const sectionId = href.substring(2);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? "bg-[#1a1a1a] shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
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
            </Link>
          </div>

          {/* Middle Section - Navigation Links */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive =
                isHomePage &&
                activeSection === link.section &&
                (link.href === "/" || link.href.startsWith("/#"));
              const isHomeLink = link.href === "/";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`font-sans text-sm transition-colors ${
                    isActive
                      ? "text-[#8B0000] border-b-2 border-[#8B0000] pb-1"
                      : isScrolled || !isHomePage
                      ? "text-white hover:text-gray-300"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/about"
              className={`font-sans text-sm transition-colors ${
                isScrolled || !isHomePage
                  ? "text-white hover:text-gray-300"
                  : "text-white/90 hover:text-white"
              }`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`font-sans text-sm transition-colors ${
                isScrolled || !isHomePage
                  ? "text-white hover:text-gray-300"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Section - Search Bar and User/Auth */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search movies"
                className={`rounded-lg px-4 py-2 pr-10 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B0000] w-48 transition-colors ${
                  isScrolled || !isHomePage
                    ? "bg-gray-800 text-white border border-gray-700"
                    : "bg-white/10 backdrop-blur-sm text-white border border-white/20 placeholder-white/60"
                }`}
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
                    stroke={isScrolled || !isHomePage ? "#999" : "rgba(255,255,255,0.6)"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* User Avatar or Login/Signup Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-400 overflow-hidden cursor-pointer flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                  <span
                    className={`text-sm hidden md:block ${
                      isScrolled || !isHomePage ? "text-white" : "text-white/90"
                    }`}
                  >
                    {user?.name || user?.email}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-[#8B0000] text-white font-sans text-sm rounded-lg hover:bg-[#6B0000] transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className={`px-4 py-2 font-sans text-sm transition-colors ${
                    isScrolled || !isHomePage
                      ? "text-white hover:text-gray-300"
                      : "text-white/90 hover:text-white"
                  }`}
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
