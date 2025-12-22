"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

export default function HeroSection() {
  return (
    <ScrollReveal>
      <section className="py-8 md:py-16 bg-[#fafafa]">
        <div className="max-w-md mx-auto px-4 md:max-w-2xl lg:max-w-4xl">
          {/* Mobile-First Hero Card */}
          <div className="bg-white rounded-[28px] p-5 shadow-lg border border-[#e5e5e5]">
            {/* Header with Search */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d0d0d0]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#d0d0d0]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#d0d0d0]"></div>
              </div>
              <div className="flex-1 h-9 rounded-full bg-[#f5f5f5]"></div>
            </div>

            {/* Welcome Message */}
            <div className="mb-4">
              <p className="text-base font-medium text-[#1a1a1a] mb-1">
                Hi, Movie Lover!
              </p>
              <p className="text-sm text-[#6f7478]">
                Welcome back to CineGhar
              </p>
            </div>

            {/* Banner Placeholder */}
            <div className="h-24 rounded-xl bg-[#f0f0f0] mb-4"></div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              <button className="px-4 py-2 rounded-full text-xs font-medium bg-[#8B0000] text-white">
                Trending
              </button>
              <button className="px-4 py-2 rounded-full text-xs font-medium bg-white text-[#6f7478] border border-[#e5e5e5] hover:bg-[#fafafa]">
                Action
              </button>
              <button className="px-4 py-2 rounded-full text-xs font-medium bg-white text-[#6f7478] border border-[#e5e5e5] hover:bg-[#fafafa]">
                Drama
              </button>
            </div>

            {/* Movie Listings */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#fafafa] border border-[#e5e5e5]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#c44569] flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a1a1a] truncate">
                    The Dark Knight
                  </p>
                  <p className="text-xs text-[#6f7478] truncate">
                    Action • Thriller
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#8B0000]/10 text-[#8B0000] font-medium flex-shrink-0">
                  4.9★
                </span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#fafafa] border border-[#e5e5e5]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f4a261] to-[#e76f51] flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a1a1a] truncate">
                    Inception
                  </p>
                  <p className="text-xs text-[#6f7478] truncate">
                    Sci-Fi • Mystery
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#8B0000]/10 text-[#8B0000] font-medium flex-shrink-0">
                  4.8★
                </span>
              </div>
            </div>
          </div>

          {/* Featured Movie Card - Desktop */}
          <div className="hidden lg:block mt-6">
            <div className="bg-white rounded-[24px] p-4 shadow-lg border border-[#e5e5e5] max-w-xs ml-auto">
              <p className="text-sm font-medium text-[#1a1a1a] mb-3">
                Featured Movie
              </p>
              <div className="h-32 rounded-lg bg-[#f0f0f0] mb-3"></div>
              <div className="h-3 rounded bg-[#f0f0f0] mb-2"></div>
              <div className="h-3 rounded bg-[#f0f0f0] w-3/4 mb-4"></div>
              <button className="w-full h-9 rounded-full bg-gradient-to-r from-[#8B0000] to-[#A00000] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Watch Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
