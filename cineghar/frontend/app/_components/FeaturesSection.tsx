"use client";

import ScrollReveal from "./ScrollReveal";

export default function FeaturesSection() {
  const features = [
    {
      title: "Curated movie collection",
      description:
        "Browse thousands of handpicked movies across all genres, from classic cinema to latest blockbusters.",
    },
    {
      title: "Personalized recommendations",
      description:
        "Get movie suggestions tailored to your taste based on your viewing history and preferences.",
    },
    {
      title: "Seamless streaming experience",
      description:
        "Watch movies in high quality with smooth playback. Access your watchlist anytime.",
    },
  ];

  return (
    <ScrollReveal>
      <section id="features" className="py-12 md:py-16 bg-white">
        <div className="max-w-md mx-auto px-4 md:max-w-2xl lg:max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2">
              Why you'll love CineGhar
            </h2>
            <p className="text-sm md:text-base text-[#6f7478] max-w-xl mx-auto">
              Designed to provide the best movie-watching experience with a clean, intuitive interface.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-[#fafafa] border border-[#e5e5e5] hover:shadow-md transition-all duration-200"
              >
                <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#6f7478] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
