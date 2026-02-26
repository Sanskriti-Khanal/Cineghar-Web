import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/uploads/**",
        port: "5050",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/uploads/**",
        port: "5050",
      },
    ],
  },
};

export default nextConfig;
