import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "*.run.app",
    "**.run.app",
    "ais-dev-xvefw3bfwj6l4tb4cxncwg-228466753855.europe-west2.run.app",
    "ais-pre-xvefw3bfwj6l4tb4cxncwg-228466753855.europe-west2.run.app",
  ],
};

export default nextConfig;
