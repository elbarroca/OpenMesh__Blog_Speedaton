'use client'

import { useEffect } from 'react'
import Main from './Main'
import { Entry } from '@/types'

const MOCK_ENTRIES: Entry[] = [
  {
    id: '1',
    title: 'Chainlink CCIP & Real-World Assets (RWA)',
    content: "Chainlink's CCIP is set to transform real-world asset (RWA) integration with blockchain. By enabling cross-chain interactions, it boosts RWA liquidity and accessibility across blockchains, bringing DeFi closer to traditional finance.",
    type: 'document',
    tags: ['chainlink', 'CCIP', 'RWA', 'blockchain'],
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    title: 'OpenMesh: A New Decentralized Storage Solution',
    content: "OpenMesh offers secure, decentralized storage, giving users control over their data. It's a refreshing alternative to traditional cloud storage, perfect for those who value privacy and data ownership.",
    type: 'journal',
    tags: ['OpenMesh', 'decentralized storage', 'Web3'],
    createdAt: new Date('2024-01-02').toISOString(),
  },
  {
    id: '3',
    title: 'Jonny from OpenMesh',
    content: "Jonny from OpenMesh is everywhere! We keep running into each other at events, and he's always full of great insights on decentralized storage. He's a cool guy—just seems to pop up all the time!",
    type: 'note',
    tags: ['OpenMesh', 'Jonny', 'networking'],
    createdAt: new Date('2024-01-03').toISOString(),
  },
]

export default function Page() {
  useEffect(() => {
    if (!localStorage.getItem('entries')) {
      localStorage.setItem('entries', JSON.stringify(MOCK_ENTRIES))
    }
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Main entries={MOCK_ENTRIES} />
    </div>
  )
}
