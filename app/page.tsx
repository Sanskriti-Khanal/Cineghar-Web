import Navbar from "./_components/Navbar";
import HeroSection from "./_components/HeroSection";
import FeaturesSection from "./_components/FeaturesSection";
import MoviesPreviewSection from "./_components/MoviesPreviewSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <MoviesPreviewSection />
      </main>
    </div>
  );
}
