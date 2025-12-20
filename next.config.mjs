const isStaticExport = process.env.NEXT_EXPORT === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // When exporting static files (e.g., for the landing upload), set NEXT_EXPORT=true before build
  output: isStaticExport ? "export" : undefined,
  images: {
    // Required for static export when using next/image
    unoptimized: isStaticExport,
  },
  trailingSlash: isStaticExport ? true : undefined,
};

export default nextConfig;
