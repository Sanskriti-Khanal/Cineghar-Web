import type { NextConfig } from "next";

// Allow backend uploads domain from env (e.g. your-api.railway.app)
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiHost = apiUrl ? new URL(apiUrl).hostname : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      ...(apiHost
        ? [
            { protocol: "https" as const, hostname: apiHost, pathname: "/uploads/**" },
            { protocol: "http" as const, hostname: apiHost, pathname: "/uploads/**" },
          ]
        : []),
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
