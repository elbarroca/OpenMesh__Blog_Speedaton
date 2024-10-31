'use client'

import Link from 'next/link'
import { 
  PlusCircleIcon, 
  DocumentTextIcon, 
  BookOpenIcon,
  PencilSquareIcon,
  LightBulbIcon 
} from '@heroicons/react/24/outline'
import { useState, useMemo, useEffect } from 'react'
import { Entry } from '@/types'

interface MainProps {
  entries?: Entry[]
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'document':
      return <DocumentTextIcon className="h-6 w-6 text-blue-599" />
    case 'journal':
      return <PencilSquareIcon className="h-6 w-6 text-green-600" />
    case 'note':
      return <LightBulbIcon className="h-6 w-6 text-amber-600" />
    default:
      return <DocumentTextIcon className="h-6 w-6 text-blue-600" />
  }
}

const WelcomeSection = () => (
  <div className="mb-8 mt-12 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-white shadow-xl ring-1 ring-gray-900/5">
    <h1 className="mb-3 text-3xl font-bold">
      Welcome to Your OpenMesh Private Notes & Journal Dashboard
    </h1>
    <p className="mb-4 text-base text-blue-100">
      A space to capture thoughts, write articles, and organize documents, all powered by OpenMASH storage. 
      Imagine it as your personal Notion, but with full data ownership.
    </p>
    <div className="space-y-3 rounded-lg bg-white/10 p-6 backdrop-blur-sm ring-1 ring-white/20">
      <h2 className="text-lg font-semibold">Here's how it works:</h2>
      <ul className="space-y-3">
        <li className="flex items-center space-x-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/70 text-sm font-bold shadow-inner ring-1 ring-white/20">1</span>
          <span>
            <strong>Create & Capture:</strong> Jot down notes, start journal entries, or draft documents with just a few clicks.
          </span>
        </li>
        <li className="flex items-center space-x-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/70 text-sm font-bold shadow-inner ring-1 ring-white/20">2</span>
          <span>
            <strong>Stay Organized:</strong> Your entries are grouped and displayed in a clean, blog-style feed.
          </span>
        </li>
        <li className="flex items-center space-x-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/70 text-sm font-bold shadow-inner ring-1 ring-white/20">3</span>
          <span>
            <strong>Decentralized & Secure:</strong> All your data is stored securely on OpenMASH—no third-party control, just your ideas, entirely yours.
          </span>
        </li>
      </ul>
    </div>
  </div>
)

const Main = ({ entries = [] }: MainProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const filteredEntries = useMemo(() => {
    return entries.filter((entry: Entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [entries, searchTerm])

  const groupedEntries = useMemo(() => {
    return filteredEntries.reduce<Record<string, Entry[]>>((acc, entry) => {
      const type = entry.type.toLowerCase()
      if (!acc[type]) acc[type] = []
      acc[type].push(entry)
      // Sort entries by date, newest first
      acc[type].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      return acc
    }, {})
  }, [filteredEntries])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <WelcomeSection />

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {['Note', 'Journal', 'Document'].map((type) => (
            <Link
              key={type}
              href={`/new?type=${type.toLowerCase()}`}
              className="group flex items-center justify-center space-x-2 rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-white/10"
            >
              {getTypeIcon(type.toLowerCase())}
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                New {type}
              </span>
            </Link>
          ))}
        </div>

        {/* Entry Lists */}
        <div className="mt-8 space-y-8">
          {Object.entries(groupedEntries).map(([type, typeEntries]) => (
            <div key={type} className="overflow-hidden rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-white/10">
              <h2 className="mb-4 flex items-center space-x-2 text-2xl font-bold capitalize text-gray-900 dark:text-white">
                {getTypeIcon(type)}
                <span>{type}s</span>
                <span className="ml-2 text-sm text-gray-500">({typeEntries.length})</span>
              </h2>
              <div className="space-y-4">
                {typeEntries.map((entry: Entry) => (
                  <Link
                    key={entry.id}
                    href={`/entry/${entry.id}`}
                    className="block rounded-lg border border-gray-200/50 bg-gray-50 p-4 transition-all hover:bg-gray-100 hover:shadow-md dark:border-gray-700/50 dark:bg-gray-900 dark:hover:bg-gray-700 hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {entry.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {entry.content.substring(0, 150)}
                      {entry.content.length > 150 && '...'}
                    </p>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-gray-200/70 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700/70 dark:text-gray-300 ring-1 ring-gray-900/5 dark:ring-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Main
