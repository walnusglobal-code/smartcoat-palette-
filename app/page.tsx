import { PaintAgentPanel } from '@/components/paint-agent-panel'
import { SmartCoatPaintWall } from '@/components/smartcoat-paint-wall'

export default function Home() {
  return <><SmartCoatPaintWall /><PaintAgentPanel /></>
}

export const dynamic = 'force-static'
