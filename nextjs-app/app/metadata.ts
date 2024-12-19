import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site-url.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Your Site Name',
    template: '%s | Your Site Name',
  },
  description: 'Your site description',
  openGraph: {
    title: 'Your Site Name',
    description: 'Your site description',
    url: siteUrl,
    siteName: 'Your Site Name',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    title: 'Your Site Name',
    card: 'summary_large_image',
  },
  icons: {
    shortcut: '/favicon.ico',
  },
} 