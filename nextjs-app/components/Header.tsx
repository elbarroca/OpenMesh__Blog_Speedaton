'use client'

import Link from 'next/link'
import ThemeSwitch from './ThemeSwitch'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()

  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/" aria-label="openmesh-blog-SC24">
          <div className="flex items-center justify-between">
            <div className="h-6 w-6">
              {/* Logo SVG here */}
            </div>
            <div className="ml-3 text-2xl font-semibold">
              openmesh-blog-SC24
            </div>
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        <Link
          href="https://github.com/elbarroca/OpenMesh__Blog_Speedaton"
          className="hidden font-medium text-gray-900 dark:text-gray-100 sm:block"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Link>
        <Link
          href="https://rbarroca.com"
          className="hidden font-medium text-gray-900 dark:text-gray-100 sm:block"
          target="_blank"
          rel="noopener noreferrer"
        >
          About Me
        </Link>
        <ThemeSwitch />
      </div>
    </header>
  )
}

export default Header
