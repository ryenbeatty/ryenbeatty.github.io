export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export type RadarContact = {
  id: string
  angle: number
  dist: number
  strength: number
}

export type MeterConfig = {
  id: string
  label: string
  base: number
  amplitude: number
  periodMs: number
}

export type TelemetryEntry = {
  id: string
  timestamp: string
  message: string
}
