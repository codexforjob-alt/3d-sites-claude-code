import type { Metadata, Viewport } from 'next'
import { Figtree, Noto_Sans, IBM_Plex_Mono } from 'next/font/google'
import { MotionProvider } from '@/components/MotionProvider'
import './globals.css'

const display = Figtree({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const body = Noto_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bright Smile Studio — стоматология без спешки',
  description:
    'Демонстрационный сайт вымышленной стоматологической клиники: услуги, процесс лечения, запись на приём.',
  robots: { index: false, follow: false },
  // Stop mobile browsers from turning house numbers and durations into call links.
  other: { 'format-detection': 'telephone=no' },
}

export const viewport: Viewport = {
  themeColor: '#07606c',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ru"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="font-body antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-deep focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Перейти к содержимому
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
