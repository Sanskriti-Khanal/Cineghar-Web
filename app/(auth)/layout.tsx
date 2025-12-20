"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRegister = pathname.includes("/register");
  const isDashboard = pathname.includes("/dashboard");
  const bannerImage = isRegister ? "/images/register_banner.png" : "/images/login_banner.png";

  // Dashboard doesn't need the banner layout
  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <section className="h-screen bg-[#2D0A0E]">
      <div className="h-full w-full grid md:grid-cols-2 md:gap-0">
        <div className="flex h-full items-center justify-center px-4 md:px-10 py-8">
          {children}
        </div>
        <div className="relative hidden md:block h-full overflow-hidden">
          <div 
            className="absolute inset-0 z-0"
            style={{
              background: 'linear-gradient(180deg, #742A1B 0%, #772B1D 15%, #7A2C1E 30%, #7B2C1F 45%, #6E2519 60%, #5A1F15 75%, #2D0A0E 100%)'
            }}
          />
          <Image
            src={bannerImage}
            alt="Auth illustration"
            fill
            priority
            className="object-cover relative z-10"
            style={{ objectPosition: 'center' }}
          />
        </div>
      </div>
    </section>
  );
}
