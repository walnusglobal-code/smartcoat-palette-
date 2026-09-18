import { SmartCoatCopilot } from '@/components/smartcoat-copilot'
import { SmartCoatOrderForm } from '@/components/smartcoat-order-form'
import { SmartCoatPaintWall } from '@/components/smartcoat-paint-wall'

export default function Home() {
  return <><SmartCoatPaintWall /><SmartCoatCopilot /><SmartCoatOrderForm /></>
}

export const dynamic = 'force-static'
