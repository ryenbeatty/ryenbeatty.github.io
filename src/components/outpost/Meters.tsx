import { useMemo, useState } from 'react'
import { OutpostPanel } from './OutpostPanel'
import type { MeterConfig } from './types'
import { rand } from './utils'
import { useAnimationFrame } from './useAnimationFrame'

const DEFAULT_METERS: MeterConfig[] = [
  { id: 'processing', label: 'Processing', base: 30, amplitude: 10, periodMs: 1200 },
  { id: 'encryption', label: 'Encryption', base: 54, amplitude: 8, periodMs: 900 },
  { id: 'scanner', label: 'Scanner', base: 72, amplitude: 6, periodMs: 700 },
]

type MetersProps = {
  meters?: MeterConfig[]
  animated?: boolean
  onValuesChange?: (values: Record<string, number>) => void
}

export function Meters({
  meters = DEFAULT_METERS,
  animated = true,
  onValuesChange,
}: MetersProps) {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(meters.map((meter) => [meter.id, meter.base]))
  )

  const meterMap = useMemo(
    () => Object.fromEntries(meters.map((meter) => [meter.id, meter])),
    [meters]
  )

  useAnimationFrame(() => {
    if (!animated) return

    const nextValues = Object.fromEntries(
      meters.map((meter) => {
        const wave = Math.sin(Date.now() / meter.periodMs) * meter.amplitude
        const jitter = rand(-6, 10)
        const value = Math.min(
          100,
          Math.max(6, Math.round(meter.base + wave + jitter))
        )
        return [meter.id, value]
      })
    ) as Record<string, number>

    setValues(nextValues)
    onValuesChange?.(nextValues)
  }, animated)

  return (
    <OutpostPanel title="Field Instruments" className="outpost-meters">
      <div className="outpost-meters__grid">
        {meters.map((meter) => (
          <div key={meter.id} className="outpost-meters__item">
            <label className="outpost-meters__label" htmlFor={`meter-${meter.id}`}>
              {meter.label}
            </label>
            <div className="outpost-meters__bar" id={`meter-${meter.id}`}>
              <div
                className="outpost-meters__fill"
                style={{ width: `${values[meter.id] ?? meterMap[meter.id]?.base ?? 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .outpost-meters__grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .outpost-meters__item {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 8px;
        }

        .outpost-meters__label {
          color: var(--outpost-muted);
          font-size: 12px;
        }

        .outpost-meters__bar {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          height: 12px;
          overflow: hidden;
        }

        .outpost-meters__fill {
          background: linear-gradient(90deg, var(--outpost-green), #b2ffb2);
          height: 100%;
          transition: width 0.2s linear;
        }
      `}</style>
    </OutpostPanel>
  )
}
