"use client";

import ScrollReveal from "./ScrollReveal";

export default function MoviesPreviewSection() {
  const movies = [
    {
      category: "Action Movies",
      badge: "Trending now",
      items: [
        {
          name: "The Dark Knight",
          meta: "Action • Thriller • Crime",
          rating: "4.8",
        },
        {
          name: "Mad Max: Fury Road",
          meta: "Action • Adventure • Sci-Fi",
          rating: "4.7",
        },
      ],
    },
    {
      category: "Drama Series",
      badge: "Top picks",
      badgeOutline: true,
      items: [
        {
          name: "Breaking Bad",
          meta: "Crime drama • 5 seasons",
        },
        {
          name: "The Crown",
          meta: "Historical drama • 6 seasons",
        },
      ],
    },
  ];

  return (
    <ScrollReveal>
      <section id="movies" className="py-12 md:py-16 bg-[#fafafa]">
        <div className="max-w-md mx-auto px-4 md:max-w-2xl lg:max-w-4xl">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2">
              Browse movies like this
            </h2>
            <p className="text-sm md:text-base text-[#6f7478]">
              Scroll through curated collections, see ratings, genres, and availability at a glance.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
            {movies.map((category, catIndex) => (
              <div
                key={catIndex}
                className="p-4 rounded-2xl bg-white border border-[#e5e5e5] shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-[#1a1a1a]">
                    {category.category}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full ${
                      category.badgeOutline
                        ? "bg-transparent border border-[#8B0000]/20 text-[#8B0000]"
                        : "bg-[#8B0000]/10 text-[#8B0000]"
                    }`}
                  >
                    {category.badge}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {category.items.map((movie, movieIndex) => (
                    <div
                      key={movieIndex}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-[#fafafa] border border-[#e5e5e5]"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#c44569] flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#1a1a1a] truncate">
                          {movie.name}
                        </p>
                        <p className="text-[10px] text-[#6f7478] truncate">
                          {movie.meta}
                        </p>
                      </div>
                      {"rating" in movie && movie.rating && (
                        <div className="text-right flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#8B0000]/10 text-[#8B0000] text-[10px] font-medium">
                            {movie.rating} ★
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
