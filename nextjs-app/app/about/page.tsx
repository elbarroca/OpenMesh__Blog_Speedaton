import { genPageMetadata } from 'app/seo'
import { Suspense } from 'react'
import AuthorLayout from '@/layouts/AuthorLayout'

export const metadata = genPageMetadata({ title: 'About' })

function AboutContent() {
  try {
    const defaultContent = {
      title: 'About',
      name: 'OpenMesh',
      avatar: '/static/images/avatar.png',
      occupation: 'Building the Future of Data',
      company: 'OpenMesh',
      email: 'address@yoursite.com',
      twitter: 'https://twitter.com/Twitter',
      linkedin: 'https://www.linkedin.com',
      github: 'https://github.com',
    }

    return (
      <AuthorLayout content={{
        ...defaultContent,
        type: 'Authors',
        slug: 'about',
        path: '/about'
      }}>
        <div className="prose dark:prose-dark max-w-none">
          <h1>About OpenMesh</h1>
          <p>
            Welcome to OpenMesh. We are dedicated to building the future of data infrastructure
            and empowering organizations with powerful data solutions.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            At OpenMesh, we believe in democratizing access to data. Our mission is to create an open, 
            decentralized data ecosystem that enables organizations of all sizes to harness the power of data
            effectively and efficiently.
          </p>

          <h2>What We Do</h2>
          <p>
            We specialize in developing cutting-edge data infrastructure solutions that help organizations:
          </p>
          <ul>
            <li>Collect and process data at scale</li>
            <li>Build robust data pipelines</li>
            <li>Implement real-time analytics</li>
            <li>Enable data-driven decision making</li>
          </ul>

          <h2>Our Values</h2>
          <p>
            Our work is guided by core values that include:
          </p>
          <ul>
            <li>Innovation and continuous improvement</li>
            <li>Open collaboration and transparency</li>
            <li>Data privacy and security</li>
            <li>User-centric design</li>
          </ul>

          <h2>Join Us</h2>
          <p>
            Whether you&apos;re a developer, data scientist, or organization looking to leverage data more effectively,
            we invite you to join us in building the future of data infrastructure. Together, we can create
            more efficient, transparent, and accessible data solutions for everyone.
          </p>
        </div>
      </AuthorLayout>
    )
  } catch (error) {
    console.error('Error rendering about page:', error)
    return (
      <div className="text-center py-10">
        <h1 className="text-xl font-bold">Error loading about page</h1>
        <p>Please try again later</p>
      </div>
    )
  }
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading about page...</div>}>
      <AboutContent />
    </Suspense>
  )
}
