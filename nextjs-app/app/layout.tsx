import './globals.css'
import { ThemeProviders } from './theme-providers'
import Header from '@/components/Header'
import { metadata as siteMetadata } from './metadata'

export const metadata = siteMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-white text-black antialiased font-sans dark:bg-gray-950 dark:text-white">
        <ThemeProviders>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Header />
            <main>{children}</main>
          </div>
        </ThemeProviders>
      </body>
    </html>
  )
}