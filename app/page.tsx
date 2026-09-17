import { PaintAgentPanel } from '@/components/paint-agent-panel'
import { SmartCoatOrderForm } from '@/components/smartcoat-order-form'
import { SmartCoatPaintWall } from '@/components/smartcoat-paint-wall'

export default function Home() {
  return <><SmartCoatPaintWall /><SmartCoatOrderForm /><PaintAgentPanel /></>
}

export const dynamic = 'force-static'
