export interface Entry {
  id: string
  title: string
  content: string
  type: 'note' | 'journal' | 'document'
  tags?: string[]
  createdAt: string
}

export interface ContentEntry extends Entry {
  path: string
  slug: string
  draft?: boolean
  summary?: string
} 