import { Amatic_SC, Merriweather, Inter } from 'next/font/google'
import Script from 'next/script'
import Header from '../components/Header'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '../lib/site'
import '../index.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-merriweather', display: 'swap' })
const amaticSC = Amatic_SC({ subsets: ['latin'], weight: ['700'], variable: '--font-amatic', display: 'swap' })

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Prince Edward County local food',
    'PEC farm collective',
    'County Farm Collective',
    'local food delivery Prince Edward County',
    'PEC farmers market',
    'Ontario local food',
    'Prince Edward County vegetables',
    'local farmers PEC',
    'weekly farm box Prince Edward County',
    'PEC growers',
    'Picton local food',
    'Wellington Ontario farmers',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: { icon: '/cabbage.png', apple: '/cabbage.png' },
  alternates: { canonical: SITE_URL },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} ${amaticSC.variable}`}>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q9051DFT5Q"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Q9051DFT5Q');
        `}</Script>
        <Header />
        <main>{children}</main>
        <footer className="mt-12 border-t border-[#e2d8ca] py-6 text-center text-xs text-[#8a7b69]">
          <p>© {new Date().getFullYear()} County Farm Collective. All rights reserved.</p>
          <a
            href="https://www.instagram.com/county.farm.collective"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-[#8a7b69] hover:text-brand-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            @county.farm.collective
          </a>
        </footer>
      </body>
    </html>
  )
}
