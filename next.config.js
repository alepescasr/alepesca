/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    
    domains: [
      "tailwindui.com",
      "res.cloudinary.com",
      "images.unsplash.com",
      "encrypted-tbn0.gstatic.com"
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
    ],

  }
}

module.exports = nextConfig
