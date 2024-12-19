import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
export const components: MDXComponents = {
  Image: Image as any,
  TOCInline: TOCInline as any,
  a: CustomLink as any,
  pre: Pre as any,
  table: TableWrapper as any,
  BlogNewsletterForm: BlogNewsletterForm as any,
}
