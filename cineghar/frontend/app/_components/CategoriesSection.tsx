"use client";

import ScrollReveal from "./ScrollReveal";
import {
  Zap,
  Heart,
  Ghost,
  Smile,
  Rocket,
  Film,
} from "lucide-react";

export default function CategoriesSection() {
  const categories = [
    { label: "Action & Adventure", icon: Zap },
    { label: "Romance", icon: Heart },
    { label: "Horror & Thriller", icon: Ghost },
    { label: "Comedy", icon: Smile },
    { label: "Sci-Fi & Fantasy", icon: Rocket },
    { label: "Drama", icon: Film },
  ];

  return (
    <ScrollReveal>
      <section id="categories" className="py-12 md:py-16 bg-white">
        <div className="max-w-md mx-auto px-4 md:max-w-2xl lg:max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-8 text-center">
            All your favorite genres, neatly organized
          </h2>

          <div className="flex flex-nowrap justify-center gap-3 overflow-x-auto pb-2">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={index}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#fafafa] border border-[#e5e5e5] text-sm text-[#6f7478] hover:bg-[#8B0000] hover:text-white hover:border-[#8B0000] transition-all duration-200"
                >
                  <Icon
                    size={18}
                    className="text-[#8B0000] group-hover:text-white transition-colors duration-200"
                  />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
