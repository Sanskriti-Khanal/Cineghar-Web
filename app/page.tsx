"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "./_components/Navbar";
import HeroSection from "./_components/HeroSection";
import FeaturesSection from "./_components/FeaturesSection";
import MoviesPreviewSection from "./_components/MoviesPreviewSection";
import CategoriesSection from "./_components/CategoriesSection";
import CTASection from "./_components/CTASection";
import Footer from "./_components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/utils/constants";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    // While redirecting, render nothing
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <MoviesPreviewSection />
        <CategoriesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
