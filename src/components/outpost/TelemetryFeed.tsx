import { useCallback, useEffect, useRef } from 'react'
import { OutpostPanel } from './OutpostPanel'
import type { TelemetryEntry } from './types'
import { createTelemetryEntry, randomHex, rand } from './utils'

const DEFAULT_MAX_LINES = 200

const TELEMETRY_LINES = [
  () => `ENG UNIT ${randomHex(4)} STATUS OK`,
  () => `ENC KEY ${randomHex(8)} ROTATE`,
  () => `LINK PING ${Math.round(rand(10, 200))}ms`,
  () =>
    `SENSOR IDX ${Math.floor(rand(100, 999))} - THERM ${Math.round(rand(-20, 60))}C`,
  () => `RADAR SWEEP ${Math.floor(rand(1, 9))}`,
  () => `ANOMALY ${randomHex(3)} DETECTED`,
  () => `FIELD INSTRUMENT ${randomHex(2)} CALIBRATED`,
  () => `LIDAR GATE ${Math.round(rand(1, 8))} ONLINE`,
]

type TelemetryFeedProps = {
  lines: TelemetryEntry[]
  onLinesChange: (lines: TelemetryEntry[]) => void
  stream?: boolean
  maxLines?: number
  intervalMs?: number
}

export function TelemetryFeed({
  lines,
  onLinesChange,
  stream = true,
  maxLines = DEFAULT_MAX_LINES,
  intervalMs = 1400,
}: TelemetryFeedProps) {
  const logRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef(lines)
  linesRef.current = lines

  const appendLine = useCallback(
    (message: string) => {
      onLinesChange(
        [createTelemetryEntry(message), ...linesRef.current].slice(0, maxLines)
      )
    },
    [maxLines, onLinesChange]
  )

  const clearLog = useCallback(() => {
    onLinesChange([createTelemetryEntry('LOG CLEARED')])
  }, [onLinesChange])

  useEffect(() => {
    if (!stream) return

    const interval = window.setInterval(() => {
      const generator =
        TELEMETRY_LINES[Math.floor(rand(0, TELEMETRY_LINES.length))]
      appendLine(generator())
    }, intervalMs + rand(0, 800))

    return () => window.clearInterval(interval)
  }, [appendLine, intervalMs, stream])

  useEffect(() => {
    logRef.current?.scrollTo({ top: 0 })
  }, [lines])

  return (
    <OutpostPanel title="Telemetry Feed" className="outpost-telemetry">
      <div
        ref={logRef}
        className="outpost-telemetry__logs"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {lines.map((line) => (
          <div key={line.id} className="outpost-telemetry__line">
            [{line.timestamp}] {line.message}
          </div>
        ))}
      </div>

      <div className="outpost-telemetry__controls">
        <button type="button" className="outpost__button" onClick={clearLog}>
          CLEAR LOG
        </button>
      </div>

      <style>{`
        .outpost-telemetry__logs {
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.02), transparent);
          border-radius: 6px;
          font-size: 13px;
          height: 320px;
          overflow: auto;
          padding: 10px;
        }

        .outpost-telemetry__line {
          border-bottom: 1px dashed rgba(255, 255, 255, 0.02);
          color: var(--outpost-green);
          line-height: 1.3;
          padding: 2px 0;
          white-space: pre-wrap;
        }

        .outpost-telemetry__controls {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
      `}</style>
    </OutpostPanel>
  )
}
