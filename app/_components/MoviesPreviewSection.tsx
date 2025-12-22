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
          price: "Watch Now",
        },
        {
          name: "Mad Max: Fury Road",
          meta: "Action • Adventure • Sci-Fi",
          rating: "4.7",
          price: "Watch Now",
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
          price: "From ₹299/month",
        },
        {
          name: "The Crown",
          meta: "Historical drama • 6 seasons",
          price: "From ₹299/month",
        },
      ],
    },
  ];

  return (
    <ScrollReveal>
      <section className="py-16 md:py-20 bg-[#f4f6ee]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#222427] mb-2">
            Browse movies like this
          </h2>
          <p className="text-base text-[#6f7478] max-w-2xl">
            Scroll through curated collections, see ratings, genres, and availability at a glance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-5">
          {movies.map((category, catIndex) => (
            <div
              key={catIndex}
              className="p-4 rounded-2xl bg-white border border-[#e2e4d9] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[#222427]">
                  {category.category}
                </span>
                <span
                  className={`text-[10px] px-2 py-1 rounded-full ${
                    category.badgeOutline
                      ? "bg-transparent border border-[#e2ebd5] text-[#6a8c3f]"
                      : "bg-[#e2ebd5] text-[#6a8c3f]"
                  }`}
                >
                  {category.badge}
                </span>
              </div>
              
              <div className="space-y-2">
                {category.items.map((movie, movieIndex) => (
                  <div
                    key={movieIndex}
                    className="flex items-center gap-3 p-2 rounded-xl bg-[#fbfbf6] border border-[#ecefdf]"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#f4e2d8] to-[#ba5370] flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#222427] truncate">
                        {movie.name}
                      </p>
                      <p className="text-[10px] text-[#6f7478] truncate">
                        {movie.meta}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {movie.rating && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e2ebd5] text-[#6a8c3f] text-[10px] font-medium mb-1 block">
                          {movie.rating} ★
                        </span>
                      )}
                      <span className="text-[10px] text-[#6f7478] block">
                        {movie.price}
                      </span>
                    </div>
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

