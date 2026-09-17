import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SmartCoat Paint Colour System',
    short_name: 'SmartCoat',
    description: 'Professional SmartCoat paint colour library by Walnus Global.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f2f0eb',
    theme_color: '#123b5a',
    orientation: 'portrait-primary',
    icons: [
      {
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-PCTaNFgod6Ni2ANqzwR96w7fhOUUUR.webp',
        sizes: '1024x1024',
        type: 'image/webp',
        purpose: 'maskable',
      },
    ],
  }
}

export const viewport = {
  themeColor: '#123b5a',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
}
