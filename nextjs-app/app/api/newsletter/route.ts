import { NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for entries
const EntrySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  type: z.enum(['note', 'journal', 'document']),
  tags: z.array(z.string()).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = EntrySchema.parse(body)

    // Mock storage for POC
    // In production, this would interact with OpenMASH
    const entry = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, entry })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}
