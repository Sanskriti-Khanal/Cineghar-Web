"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

export default function CTASection() {
  return (
    <ScrollReveal>
      <section id="cta" className="py-12 md:py-16 bg-gradient-to-r from-[#8B0000] to-[#A00000] text-white">
        <div className="max-w-md mx-auto px-4 md:max-w-2xl lg:max-w-4xl">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Start your movie journey today
              </h2>
              <p className="text-sm md:text-base text-white/90 max-w-xl mx-auto md:mx-0">
                Join thousands of movie enthusiasts and discover your next favorite film. 
                Sign up now to get personalized recommendations.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/register"
                className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/30 flex flex-col items-center sm:items-start min-w-[140px] hover:bg-white/20 transition-all duration-200"
              >
                <span className="text-[10px] uppercase tracking-wider opacity-90 mb-1">
                  Available on
                </span>
                <span className="text-sm font-semibold">Web Platform</span>
              </Link>
              <button
                type="button"
                className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/30 flex flex-col items-center sm:items-start min-w-[140px] hover:bg-white/20 transition-all duration-200"
              >
                <span className="text-[10px] uppercase tracking-wider opacity-90 mb-1">
                  Coming soon
                </span>
                <span className="text-sm font-semibold">Mobile App</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
