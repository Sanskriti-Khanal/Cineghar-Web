import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Navbar from "@/app/_components/Navbar";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-start overflow-hidden pt-16">
          {/* Hero Image - Full Background */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/newhero.png"
              alt="Hero Section"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
          </div>
          
          {/* Content Overlay - Left Side */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
            <div className="flex justify-start">
              <div className="text-left space-y-6 max-w-2xl">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    Welcome to Your
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8B0000] to-[#A00000]">
                      Movie Dashboard
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed">
                    Explore movies, manage your loyalty points, track sales, and discover what's currently streaming.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Dashboard Overview
            </h2>
            <p className="text-gray-600">
              Navigate through the sections above to explore movies, loyalty points, sales, and streaming content.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
