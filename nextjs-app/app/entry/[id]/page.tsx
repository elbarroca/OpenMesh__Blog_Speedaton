'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Entry } from '@/types'

export default function EntryPage() {
  const params = useParams()
  const router = useRouter()
  const [entry, setEntry] = useState<Entry | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  })

  useEffect(() => {
    // In a real app, fetch from API
    // For now, get from localStorage
    const storedEntries = JSON.parse(localStorage.getItem('entries') || '[]')
    const foundEntry = storedEntries.find((e: Entry) => e.id === params.id)
    if (foundEntry) {
      setEntry(foundEntry)
      setFormData({
        title: foundEntry.title,
        content: foundEntry.content,
        tags: foundEntry.tags?.join(', ') || '',
      })
    }
  }, [params.id])

  const handleSave = async () => {
    if (!entry) return

    const updatedEntry = {
      ...entry,
      title: formData.title,
      content: formData.content,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    }

    // In a real app, save to API
    // For now, save to localStorage
    const storedEntries = JSON.parse(localStorage.getItem('entries') || '[]')
    const updatedEntries = storedEntries.map((e: Entry) =>
      e.id === entry.id ? updatedEntry : e
    )
    localStorage.setItem('entries', JSON.stringify(updatedEntries))

    setEntry(updatedEntry)
    setIsEditing(false)
  }

  if (!entry) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ← Back to Dashboard
          </Link>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{entry.title}</h1>
            <div className="flex flex-wrap gap-2">
              {entry.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="prose prose-lg dark:prose-invert">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {entry.content}
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date(entry.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 