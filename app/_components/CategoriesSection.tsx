"use client";

import ScrollReveal from "./ScrollReveal";

export default function CategoriesSection() {
  const categories = [
    { icon: "🎬", label: "Action & Adventure" },
    { icon: "💔", label: "Romance" },
    { icon: "😱", label: "Horror & Thriller" },
    { icon: "😂", label: "Comedy" },
    { icon: "🔬", label: "Sci-Fi & Fantasy" },
    { icon: "📚", label: "Drama" },
  ];

  return (
    <ScrollReveal>
      <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[#222427] mb-10 text-center">
          All your favorite genres, neatly organized
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <button
              key={index}
              className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#f4f6ee] border border-[#e2e4d9] text-sm text-[#6f7478] hover:bg-[#f9faf4] hover:border-[#8B0000]/40 hover:text-[#222427] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#6a8c3f]/8 text-base group-hover:bg-[#6a8c3f]/12 group-hover:scale-110 transition-all">
                {category.icon}
              </span>
              <span className="relative z-10">{category.label}</span>
              <span
                className="absolute inset-0 bg-gradient-to-r from-[#9abe6a]/18 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: "radial-gradient(circle at 0% 0%, rgba(154, 190, 106, 0.18), transparent 55%)",
                }}
              ></span>
            </button>
          ))}
        </div>
      </div>
      </section>
    </ScrollReveal>
  );
}

