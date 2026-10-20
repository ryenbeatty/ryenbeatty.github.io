import { useCallback, useEffect, useRef, useState } from 'react'
import { OutpostPanel } from './OutpostPanel'
import type { RadarContact } from './types'
import { rand, randomHex } from './utils'
import { useAnimationFrame } from './useAnimationFrame'

const CANVAS_SIZE = 480

type WeatherRadarProps = {
  onContact?: (contact: RadarContact) => void
  onLog?: (message: string) => void
  scanSpeed?: number
}

export function WeatherRadar({
  onContact,
  onLog,
  scanSpeed = 1,
}: WeatherRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanning, setScanning] = useState(true)
  const [contacts, setContacts] = useState<RadarContact[]>([])
  const [rangeKm, setRangeKm] = useState(120)
  const [pingMs, setPingMs] = useState(42)
  const sweepAngleRef = useRef(0)
  const scanStrengthRef = useRef(0.72)
  const lastReadoutUpdateRef = useRef(0)

  const drawRadar = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 8

    ctx.clearRect(0, 0, width, height)
    ctx.save()
    ctx.translate(centerX, centerY)

    const glow = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius)
    glow.addColorStop(0, 'rgba(57, 255, 20, 0.06)')
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = 'rgba(57, 255, 20, 0.12)'
    ctx.lineWidth = 1
    for (let ring = 1; ring <= 4; ring += 1) {
      ctx.beginPath()
      ctx.arc(0, 0, (radius / 4) * ring, 0, Math.PI * 2)
      ctx.stroke()
    }

    ctx.strokeStyle = 'rgba(57, 255, 20, 0.08)'
    ctx.beginPath()
    ctx.moveTo(-radius, 0)
    ctx.lineTo(radius, 0)
    ctx.moveTo(0, -radius)
    ctx.lineTo(0, radius)
    ctx.stroke()

    contacts.forEach((contact) => {
      const angle = contact.angle - Math.PI / 2
      const distance = contact.dist * radius
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance

      ctx.fillStyle = 'rgba(255, 60, 60, 0.9)'
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'rgba(255, 60, 60, 0.18)'
      ctx.beginPath()
      ctx.arc(x, y, 14, 0, Math.PI * 2)
      ctx.fill()
    })

    if (scanning) {
      sweepAngleRef.current +=
        0.02 + Math.max(0, scanStrengthRef.current - 0.4) * 0.02 * scanSpeed
    }

    const sweepRad = sweepAngleRef.current % (Math.PI * 2)
    const sweepGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
    sweepGradient.addColorStop(0, 'rgba(57, 255, 20, 0.35)')
    sweepGradient.addColorStop(1, 'rgba(57, 255, 20, 0.02)')

    ctx.fillStyle = sweepGradient
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, radius, sweepRad - 0.08, sweepRad + 0.08)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = 'rgba(57, 255, 20, 0.9)'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(Math.cos(sweepRad) * radius, Math.sin(sweepRad) * radius)
    ctx.stroke()

    ctx.restore()
  }, [contacts, scanning, scanSpeed])

  useAnimationFrame((time) => {
    drawRadar()
    if (time - lastReadoutUpdateRef.current > 500) {
      lastReadoutUpdateRef.current = time
      setRangeKm(Math.round(rand(40, 220)))
      setPingMs(Math.round(rand(20, 180)))
    }
  })

  const addContact = useCallback(
    (simulated = false) => {
      const contact: RadarContact = {
        id: `${simulated ? 'SIM' : 'TGT'}-${randomHex(3)}`,
        angle: rand(0, Math.PI * 2),
        dist: rand(simulated ? 0.2 : 0.12, simulated ? 0.7 : 0.9),
        strength: rand(simulated ? 0.6 : 0.2, simulated ? 0.98 : 1),
      }

      setContacts((current) => [...current.slice(-5), contact])
      onContact?.(contact)
      onLog?.(
        `${simulated ? 'SIMULATED CONTACT' : 'CONTACT ACQUIRED'} ${contact.id} @ ${Math.round(contact.dist * 200)}km`
      )
    },
    [onContact, onLog]
  )

  useEffect(() => {
    if (!scanning) return

    const interval = window.setInterval(() => {
      if (Math.random() < 0.12) addContact(false)
      setContacts((current) =>
        current.length > 6 && Math.random() < 0.3 ? current.slice(1) : current
      )
    }, 1400)

    return () => window.clearInterval(interval)
  }, [addContact, scanning])

  return (
    <OutpostPanel title="Weather Radar" className="outpost-radar" bodyClassName="outpost-radar__body">
      <div className="outpost-radar__display">
        <canvas
          ref={canvasRef}
          className="outpost-radar__canvas"
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          aria-label="Weather radar display"
        />
        <div className="outpost-radar__overlay">
          <div className="outpost__readout outpost-radar__readouts">
            <div>
              Range: <strong>{rangeKm} km</strong>
            </div>
            <div>
              Ping: <strong>{pingMs} ms</strong>
            </div>
          </div>
          <div className="outpost-radar__controls">
            <button
              type="button"
              className="outpost__button"
              onClick={() => {
                setScanning((value) => {
                  const next = !value
                  onLog?.(next ? 'SCANNER: RESUMED' : 'SCANNER: PAUSED')
                  return next
                })
              }}
            >
              {scanning ? 'PAUSE' : 'RESUME'}
            </button>
            <button
              type="button"
              className="outpost__button"
              onClick={() => addContact(true)}
            >
              SIM CONTACT
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .outpost-radar__body {
          padding: 0;
        }

        .outpost-radar__display {
          position: relative;
          background: linear-gradient(180deg, #081014, #071014);
          border-radius: 10px;
          display: flex;
          justify-content: center;
          padding: 12px;
        }

        .outpost-radar__canvas {
          background: radial-gradient(circle at 40% 30%, rgba(0, 0, 0, 0.05), transparent 30%);
          border-radius: 8px;
          box-shadow: inset 0 0 30px rgba(57, 255, 20, 0.02);
          display: block;
          width: 100%;
          height: auto;
          max-width: 100%;
        }

        .outpost-radar__overlay {
          display: flex;
          flex-direction: column;
          inset: 12px;
          justify-content: space-between;
          pointer-events: none;
          position: absolute;
        }

        .outpost-radar__readouts {
          margin: 6px;
          pointer-events: auto;
        }

        .outpost-radar__controls {
          align-self: flex-end;
          display: flex;
          gap: 8px;
          margin: 6px;
          pointer-events: auto;
        }

      `}</style>
    </OutpostPanel>
  )
}
