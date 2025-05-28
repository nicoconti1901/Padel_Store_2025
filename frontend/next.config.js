/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Permite cualquier ruta dentro de este hostname
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'babolatchile.cl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.wilsonstore.com.ar',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.puntosport.com.ar',
        port: '',
        pathname: '/**',
      }
    ],
    domains: ['babolatchile.cl'],
  },
}

module.exports = nextConfig 