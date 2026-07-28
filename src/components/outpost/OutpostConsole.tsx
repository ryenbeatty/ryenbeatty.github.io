import { useCallback, useEffect, useRef, useState } from 'react'
import { ChartPlotter } from './ChartPlotter'
import { LidarBackscatter } from './LidarBackscatter'
import { Meters } from './Meters'
import { TelemetryFeed } from './TelemetryFeed'
import { WeatherRadar } from './WeatherRadar'
import type { RadarContact, TelemetryEntry, ThreatLevel } from './types'
import {
  createTelemetryEntry,
  formatBootTimer,
  nowTime,
} from './utils'
import './outpost.css'

const THREAT_COLORS: Record<ThreatLevel, string> = {
  LOW: '#39ff14',
  MEDIUM: '#ffcc00',
  HIGH: '#ff6b6b',
}

const AI_MODE: Record<ThreatLevel, string> = {
  LOW: 'STANDBY',
  MEDIUM: 'WATCH',
  HIGH: 'ENGAGE',
}

export function OutpostConsole() {
  const bootStartRef = useRef(Date.now())
  const [bootTimer, setBootTimer] = useState('00:00')
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('LOW')
  const [lines, setLines] = useState<TelemetryEntry[]>([
    createTelemetryEntry('SYS: Outpost Console Initialized'),
    createTelemetryEntry('SYS: Starting telemetry streams'),
  ])
  const [lastUpdate, setLastUpdate] = useState(nowTime())
  const [target, setTarget] = useState({
    id: '-',
    coords: '-',
    signal: '-',
  })

  const handleLinesChange = useCallback((next: TelemetryEntry[]) => {
    setLines(next)
    setLastUpdate(nowTime())
  }, [])

  const appendLine = useCallback(
    (message: string) => {
      setLines((current) => {
        const next = [createTelemetryEntry(message), ...current].slice(0, 200)
        setLastUpdate(nowTime())
        return next
      })
    },
    []
  )

  useEffect(() => {
    const interval = window.setInterval(() => {
      setBootTimer(formatBootTimer(bootStartRef.current))
    }, 500)

    return () => window.clearInterval(interval)
  }, [])

  const handleContact = useCallback(
    (contact: RadarContact) => {
      setTarget({
        id: contact.id,
        coords: `${(Math.cos(contact.angle) * 180).toFixed(1)}, ${(Math.sin(contact.angle) * 90).toFixed(1)}`,
        signal: `${Math.round(contact.strength * 100)}%`,
      })

      if (contact.strength > 0.85) {
        setThreatLevel('HIGH')
        appendLine('ALERT: Threat level HIGH — prepare intercept')
      } else if (contact.strength > 0.6) {
        setThreatLevel('MEDIUM')
      } else {
        setThreatLevel('LOW')
      }
    },
    [appendLine]
  )

  return (
    <div className="outpost outpost__console">
      <header className="outpost__topbar">
        <div className="outpost__title">
          <span className="outpost__badge">CLASSIFIED</span>
          Outpost Command Console — Boot Sequence:{' '}
          <span>{bootTimer}</span>
        </div>
        <div className="outpost__status">
          <div>
            AI MODE:{' '}
            <strong style={{ color: THREAT_COLORS[threatLevel] }}>
              {AI_MODE[threatLevel]}
            </strong>
          </div>
          <div>
            THREAT LVL:{' '}
            <strong style={{ color: THREAT_COLORS[threatLevel] }}>
              {threatLevel}
            </strong>
          </div>
        </div>
      </header>

      <main className="outpost__grid">
        <section className="outpost__column">
          <WeatherRadar onContact={handleContact} onLog={appendLine} />
          <Meters />
          <ChartPlotter />
          <LidarBackscatter />
        </section>

        <section className="outpost__column">
          <TelemetryFeed
            lines={lines}
            onLinesChange={handleLinesChange}
            stream
          />
          <div className="outpost-info-grid">
            <div className="outpost-info-grid__item">
              <div className="outpost-info-grid__label">Target</div>
              <div className="outpost-info-grid__value">{target.id}</div>
            </div>
            <div className="outpost-info-grid__item">
              <div className="outpost-info-grid__label">Coords</div>
              <div className="outpost-info-grid__value">{target.coords}</div>
            </div>
            <div className="outpost-info-grid__item">
              <div className="outpost-info-grid__label">Signal</div>
              <div className="outpost-info-grid__value">{target.signal}</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="outpost__footer">
        <div>Outpost Console — Simulation Only</div>
        <div>
          Last Update: <span>{lastUpdate}</span>
        </div>
      </footer>

      <style>{`
        .outpost-info-grid {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(3, 1fr);
        }

        .outpost-info-grid__item {
          background: var(--outpost-panel);
          border: 1px solid rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          padding: 10px;
        }

        .outpost-info-grid__label {
          color: var(--outpost-muted);
          font-size: 12px;
        }

        .outpost-info-grid__value {
          color: var(--outpost-green);
          font-weight: 700;
          margin-top: 6px;
        }

        @media (max-width: 700px) {
          .outpost-info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
