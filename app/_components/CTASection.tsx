"use client";

export default function CTASection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-[#8B0000] to-[#A00000] text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Start your movie journey today
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto md:mx-0">
              Join thousands of movie enthusiasts and discover your next favorite film. 
              Sign up now to get personalized recommendations and exclusive content.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              type="button"
              className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/50 flex flex-col items-start min-w-[140px] hover:bg-white/16 hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
            >
              <span className="text-[10px] uppercase tracking-wider opacity-90 mb-1">
                Available on
              </span>
              <span className="text-sm font-semibold">Web Platform</span>
            </button>
            <button
              type="button"
              className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/50 flex flex-col items-start min-w-[140px] hover:bg-white/16 hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
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
  );
}

