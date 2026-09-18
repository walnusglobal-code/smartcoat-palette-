'use client'

import { useState } from 'react'
import { SmartCoatOrderWorkflow } from '@/components/smartcoat-order-workflow'
import { SmartCoatPaintWall } from '@/components/smartcoat-paint-wall'
import { initialColour, type PaintColour } from '@/lib/paint-colours'

export default function Home() {
  const [selectedColour, setSelectedColour] = useState<PaintColour>(initialColour)
  return <><SmartCoatPaintWall onColourChange={setSelectedColour} /><SmartCoatOrderWorkflow selectedColour={selectedColour} onChangeColour={() => document.querySelector('#colour-wall')?.scrollIntoView({ behavior: 'smooth' })} /></>
}

export const dynamic = 'force-static'
