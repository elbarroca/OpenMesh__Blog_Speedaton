import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Revalidate all potential paths
    revalidatePath('/')
    revalidatePath('/entries')
    revalidatePath('/documents')
    revalidatePath('/journals')
    revalidatePath('/notes')
    
    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ 
      revalidated: false, 
      message: 'Error revalidating', 
      error: err 
    }, { status: 500 })
  }
} 