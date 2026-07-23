import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "www.k-non-restaurant.fr",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        }
    }
};

export default nextConfig;
