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
    <section className="h-screen bg-[#500C0B]">
      <div className="h-full w-full grid md:grid-cols-2 md:gap-0">
        <div className="flex h-full items-center justify-center px-4 md:px-10 py-8 bg-[#500C0B]">
          {children}
        </div>
        <div className="relative hidden md:block h-full overflow-hidden bg-[#500C0B]">
          <Image
            src={bannerImage}
            alt="Auth illustration"
            fill
            priority
            className="object-contain relative z-10"
            style={{ objectPosition: 'center center' }}
            sizes="50vw"
          />
        </div>
      </div>
    </section>
  );
}
