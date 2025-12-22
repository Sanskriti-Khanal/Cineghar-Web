"use client";

export default function FeaturesSection() {
  const features = [
    {
      title: "Curated movie collection",
      description: "Browse thousands of handpicked movies across all genres, from classic cinema to latest blockbusters, all in one organized library.",
    },
    {
      title: "Personalized recommendations",
      description: "Get movie suggestions tailored to your taste based on your viewing history and preferences. Discover your next favorite film.",
    },
    {
      title: "Seamless streaming experience",
      description: "Watch movies in high quality with smooth playback. Access your watchlist and continue watching from where you left off.",
    },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#222427] mb-2">
            Why you'll love CineGhar
          </h2>
          <p className="text-base text-[#6f7478] max-w-2xl mx-auto">
            Designed to provide the best movie-watching experience with a clean, intuitive interface.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <article
              key={index}
              className="p-5 rounded-2xl bg-white border border-[#e2e4d9] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 hover:border-[#8B0000]/40"
            >
              <h3 className="text-lg font-semibold text-[#222427] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#6f7478] leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

