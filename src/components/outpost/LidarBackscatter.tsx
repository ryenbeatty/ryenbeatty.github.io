import { useCallback, useRef } from 'react'
import { OutpostPanel } from './OutpostPanel'
import { rand } from './utils'
import { useAnimationFrame } from './useAnimationFrame'

const WIDTH = 640
const HEIGHT = 260
const COLUMNS = 72

type LidarBackscatterProps = {
  title?: string
}

export function LidarBackscatter({
  title = 'Lidar Backscatter',
}: LidarBackscatterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const columnsRef = useRef<number[]>(
    Array.from({ length: COLUMNS }, () => rand(0.1, 0.9))
  )
  const driftRef = useRef(0)

  const drawBackscatter = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    driftRef.current += 0.03
    const drift = driftRef.current

    columnsRef.current = columnsRef.current.map((value, index) => {
      const atmospheric =
        Math.sin(drift + index * 0.18) * 0.18 +
        Math.sin(drift * 0.6 + index * 0.05) * 0.12
      const next = value * 0.82 + (0.45 + atmospheric) * 0.18 + rand(-0.04, 0.04)
      return Math.min(1, Math.max(0.04, next))
    })

    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    const columnWidth = WIDTH / COLUMNS

    columnsRef.current.forEach((intensity, index) => {
      const x = index * columnWidth
      const barHeight = intensity * (HEIGHT - 24)
      const gradient = ctx.createLinearGradient(x, HEIGHT, x, HEIGHT - barHeight)
      gradient.addColorStop(0, 'rgba(57, 255, 20, 0.08)')
      gradient.addColorStop(0.45, `rgba(57, 255, 20, ${0.2 + intensity * 0.35})`)
      gradient.addColorStop(1, `rgba(178, 255, 178, ${0.35 + intensity * 0.5})`)

      ctx.fillStyle = gradient
      ctx.fillRect(x + 1, HEIGHT - barHeight - 12, columnWidth - 2, barHeight)

      ctx.fillStyle = `rgba(57, 255, 20, ${0.15 + intensity * 0.45})`
      ctx.fillRect(x + 1, HEIGHT - barHeight - 14, columnWidth - 2, 2)
    })

    ctx.strokeStyle = 'rgba(57, 255, 20, 0.12)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, HEIGHT - 12)
    ctx.lineTo(WIDTH, HEIGHT - 12)
    ctx.stroke()

    ctx.fillStyle = 'rgba(147, 161, 161, 0.9)'
    ctx.font = '11px ui-monospace, monospace'
    ctx.fillText('ALT km', 8, 14)
    ctx.fillText('BACKSCATTER σ', WIDTH - 108, 14)
  }, [])

  useAnimationFrame(drawBackscatter)

  return (
    <OutpostPanel title={title} className="outpost-lidar">
      <canvas
        ref={canvasRef}
        className="outpost-lidar__canvas"
        width={WIDTH}
        height={HEIGHT}
        aria-label="Lidar backscatter profile"
      />

      <style>{`
        .outpost-lidar__canvas {
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.05));
          border-radius: 6px;
          display: block;
          height: auto;
          max-width: 100%;
          width: 100%;
        }
      `}</style>
    </OutpostPanel>
  )
}
