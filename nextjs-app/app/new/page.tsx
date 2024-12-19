'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Entry } from '@/types'

function NewEntryForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const entryType = searchParams.get('type') || 'note'

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    entryType,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create new entry object with 'user-' prefix to distinguish from mock entries
      const newEntry: Entry = {
        id: `user-${Date.now()}`, // Add 'user-' prefix
        title: formData.title,
        content: formData.content,
        type: formData.entryType as 'note' | 'journal' | 'document',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
      }

      // Get existing entries from localStorage
      const existingEntries = JSON.parse(localStorage.getItem('entries') || '[]')
      
      // Add new entry to existing entries
      const updatedEntries = [...existingEntries, newEntry]
      
      // Save back to localStorage
      localStorage.setItem('entries', JSON.stringify(updatedEntries))

      // Redirect to dashboard
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('Failed to save entry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            New {entryType.charAt(0).toUpperCase() + entryType.slice(1)}
          </h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Content
            </label>
            <textarea
              name="content"
              id="content"
              required
              rows={8}
              value={formData.content}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., work, personal, important"
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function NewEntryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewEntryForm />
    </Suspense>
  )
} 