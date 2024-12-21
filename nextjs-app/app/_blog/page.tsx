import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, CoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allEntries } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { allBlogs } from '@/.contentlayer/generated/Blog/_index.mjs'
import { Blog } from '@/.contentlayer/generated/types'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })

export default function BlogPage() {
  const posts = allCoreContent(sortPosts(allBlogs))
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={posts as CoreContent<Blog>[]}
      initialDisplayPosts={initialDisplayPosts as CoreContent<Blog>[]}
      pagination={pagination}
      title="All Posts"
    />
  )
}
