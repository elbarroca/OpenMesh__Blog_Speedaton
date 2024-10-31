import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const entry = await request.json()
    const { title, content, tags, entryType } = entry
    
    // Create the content directory if it doesn't exist
    const contentDir = path.join(process.cwd(), 'content')
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir)
    }

    // Create type-specific directory if it doesn't exist
    const typeDir = path.join(contentDir, `${entryType}s`)
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir)
    }

    // Create filename from title and date
    const date = new Date().toISOString().split('T')[0]
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const filename = `${date}-${slug}.mdx`
    
    // Create MDX content
    const mdxContent = `---
title: ${title}
date: ${new Date().toISOString()}
tags: [${tags.join(', ')}]
entryType: ${entryType}
---

${content}
`

    // Write the file
    fs.writeFileSync(path.join(typeDir, filename), mdxContent)

    // Revalidate the content
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/revalidate`, {
      method: 'POST',
    })

    return NextResponse.json({ success: true, message: 'Entry saved successfully' })
  } catch (error) {
    console.error('Error saving entry:', error)
    return NextResponse.json(
      { success: false, message: 'Error saving entry', error },
      { status: 500 }
    )
  }
} 