import { allBlogs } from 'contentlayer/generated'
import { Entry } from '@/types'

export const convertBlogsToEntries = (): Entry[] => {
  return allBlogs.map((blog) => ({
    id: blog._id,
    title: blog.title,
    content: blog.body.raw,
    type: 'document', // Default type for blog posts
    tags: blog.tags || [],
    createdAt: blog.date,
  }))
} 