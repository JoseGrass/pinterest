// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'picsum.photos',
      'lygbdgxujnncomdcupwt.supabase.co',
      'images.unsplash.com',
      'via.placeholder.com',
      'loremflickr.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite cualquier hostname (cuidado en producción)
      },
    ],
  },
}

module.exports = nextConfig