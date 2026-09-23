import type { NextConfig } from 'next';

// El API sirve las imágenes de producto desde /api/files/producto
const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
);

const esDesarrollo = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: '/api/files/**',
      },
      // Imágenes externas pegadas a mano en el formulario de producto
      { protocol: 'https', hostname: '**' },
    ],
    // Next 16 bloquea optimizar imágenes alojadas en IPs locales para evitar
    // que se use el optimizador como puente a la red interna. En desarrollo el
    // API es localhost, así que solo ahí se permite.
    dangerouslyAllowLocalIP: esDesarrollo,
  },
};

export default nextConfig;
