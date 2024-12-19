import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import path from 'path'

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    lastmod: { type: 'date' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'json' },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'string' },
    bibliography: { type: 'string' },
    canonicalUrl: { type: 'string' },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => path.basename(doc._raw.sourceFilePath, path.extname(doc._raw.sourceFilePath))
    },
    path: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
  },
}))

export const Authors = defineDocumentType(() => ({
  name: 'Authors',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string' },
    occupation: { type: 'string' },
    company: { type: 'string' },
    email: { type: 'string' },
    twitter: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => path.basename(doc._raw.sourceFilePath, path.extname(doc._raw.sourceFilePath))
    },
    path: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
    body: { type: 'json', resolve: (doc) => doc.body },
  },
}))

export const Entry = defineDocumentType(() => ({
  name: 'Entry',
  filePathPattern: 'entries/**/*.{md,mdx}',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    entryType: { 
      type: 'enum', 
      options: ['note', 'journal', 'document'],
      required: true,
      default: 'document'
    },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => path.basename(doc._raw.sourceFilePath, path.extname(doc._raw.sourceFilePath))
    },
    path: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Blog, Entry, Authors],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
  disableImportAliasWarning: true,
  onSuccess: async (importData) => {
    console.log('Content updated successfully')
  },
})
