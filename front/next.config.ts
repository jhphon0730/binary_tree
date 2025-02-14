import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
	images: {
		domains: ['localhost'],
	},
	env: {
		NEXT_PUBLIC_API_BASE_URL: "http://localhost:8080",
	},
};

export default nextConfig;
