import './globals.css'
import { ThemeProviders } from './theme-providers'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'openmesh-blog-SC24',
  description: 'A decentralized platform for your notes, journals, and documents powered by OpenMASH',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-black antialiased dark:bg-gray-950 dark:text-white`}>
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