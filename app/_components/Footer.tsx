"use client";

import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#d7dcc6]/90 bg-[#fafaf5]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/logo.png"
              alt="CineGhar Logo"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="text-lg font-semibold text-[#222427]">
              CineGhar
            </span>
          </div>
          <p className="text-xs text-[#6f7478]">
            © {currentYear} CineGhar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

