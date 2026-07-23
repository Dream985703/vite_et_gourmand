import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "www.k-non-restaurant.fr",
            },
        ],
    },
};

export default nextConfig;
