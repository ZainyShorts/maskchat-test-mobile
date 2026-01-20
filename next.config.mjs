/**  @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,

  // images: {
  //   domains: ['cdn.pixabay.com']
  // },
  images: {
    domains: ['images.pexels.com'],
    remotePatterns: [
      {
      protocol: 'http', // Allow HTTP explicitly
      hostname: 'example.com',
     },
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },

  // TODO: below line is added to resolve twice event dispatch in the calendar reducer
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en/home',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
