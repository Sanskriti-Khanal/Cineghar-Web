"use client";

import ScrollReveal from "./ScrollReveal";

export default function CategoriesSection() {
  const categories = [
    { label: "Action & Adventure" },
    { label: "Romance" },
    { label: "Horror & Thriller" },
    { label: "Comedy" },
    { label: "Sci-Fi & Fantasy" },
    { label: "Drama" },
  ];

  return (
    <ScrollReveal>
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-md mx-auto px-4 md:max-w-2xl lg:max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-8 text-center">
            All your favorite genres, neatly organized
          </h2>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className="px-5 py-2.5 rounded-full bg-[#fafafa] border border-[#e5e5e5] text-sm text-[#6f7478] hover:bg-[#8B0000] hover:text-white hover:border-[#8B0000] transition-all duration-200"
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
