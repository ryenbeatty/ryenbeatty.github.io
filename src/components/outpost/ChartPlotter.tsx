import { useCallback, useRef } from 'react'
import { OutpostPanel } from './OutpostPanel'
import { rand } from './utils'
import { useAnimationFrame } from './useAnimationFrame'

const WIDTH = 640
const HEIGHT = 220
const HISTORY_LENGTH = 120

type ChartPlotterProps = {
  title?: string
  channels?: string[]
}

export function ChartPlotter({
  title = 'Chart Plotter',
  channels = ['SIG-A', 'SIG-B', 'SIG-C'],
}: ChartPlotterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const historyRef = useRef<number[][]>(
    channels.map(() => Array.from({ length: HISTORY_LENGTH }, () => 0))
  )
  const phaseRef = useRef(0)

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    phaseRef.current += 0.04
    const phase = phaseRef.current

    historyRef.current = historyRef.current.map((series, index) => {
      const nextValue =
        0.5 +
        Math.sin(phase + index * 1.4) * 0.22 +
        Math.sin(phase * 2.3 + index) * 0.08 +
        rand(-0.03, 0.03)

      return [...series.slice(1), Math.min(1, Math.max(0, nextValue))]
    })

    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    ctx.strokeStyle = 'rgba(57, 255, 20, 0.08)'
    ctx.lineWidth = 1
    for (let row = 0; row <= 4; row += 1) {
      const y = (HEIGHT / 4) * row
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(WIDTH, y)
      ctx.stroke()
    }

    for (let column = 0; column <= 8; column += 1) {
      const x = (WIDTH / 8) * column
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, HEIGHT)
      ctx.stroke()
    }

    const colors = ['#39ff14', '#7ef27e', '#b2ffb2']

    historyRef.current.forEach((series, index) => {
      ctx.strokeStyle = colors[index % colors.length]
      ctx.lineWidth = index === 0 ? 2 : 1.5
      ctx.beginPath()

      series.forEach((value, pointIndex) => {
        const x = (pointIndex / (HISTORY_LENGTH - 1)) * WIDTH
        const y = HEIGHT - value * (HEIGHT - 16) - 8
        if (pointIndex === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })

      ctx.stroke()
    })
  }, [])

  useAnimationFrame(drawChart)

  return (
    <OutpostPanel title={title} className="outpost-chart">
      <div className="outpost-chart__legend">
        {channels.map((channel, index) => (
          <span key={channel} className="outpost-chart__legend-item">
            <span
              className="outpost-chart__swatch"
              style={{
                backgroundColor: ['#39ff14', '#7ef27e', '#b2ffb2'][index % 3],
              }}
            />
            {channel}
          </span>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className="outpost-chart__canvas"
        width={WIDTH}
        height={HEIGHT}
        aria-label="Telemetry chart plotter"
      />

      <style>{`
        .outpost-chart__legend {
          display: flex;
          flex-wrap: wrap;
          font-size: 12px;
          gap: 12px;
        }

        .outpost-chart__legend-item {
          align-items: center;
          color: var(--outpost-muted);
          display: inline-flex;
          gap: 6px;
        }

        .outpost-chart__swatch {
          border-radius: 999px;
          height: 8px;
          width: 8px;
        }

        .outpost-chart__canvas {
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
