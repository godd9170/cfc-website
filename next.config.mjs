/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // LocalLine product photos (used via next/image on /join).
    remotePatterns: [
      { protocol: 'https', hostname: 'localline-public-images.s3.amazonaws.com', pathname: '/account/**' },
    ],
  },
}
export default nextConfig
