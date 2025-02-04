import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
	images: {
		domains: ['192.168.0.5'],
	},
};

export default nextConfig;
