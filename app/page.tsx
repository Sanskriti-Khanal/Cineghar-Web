import Navbar from "./_components/Navbar";
import HeroSection from "./_components/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
      </main>
    </div>
  );
}
