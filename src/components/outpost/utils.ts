export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function nowTime() {
  return new Date().toLocaleTimeString()
}

export function randomHex(length = 6) {
  return Math.floor(Math.random() * 16 ** length)
    .toString(16)
    .padStart(length, '0')
    .toUpperCase()
}

export function formatBootTimer(startMs: number) {
  const seconds = Math.floor((Date.now() - startMs) / 1000)
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const remainder = String(seconds % 60).padStart(2, '0')
  return `${minutes}:${remainder}`
}

import type { TelemetryEntry } from './types'

export function createTelemetryEntry(message: string): TelemetryEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: nowTime(),
    message,
  }
}
