import { useState } from 'react'
import { ChartPlotter } from './ChartPlotter'
import { LidarBackscatter } from './LidarBackscatter'
import { Meters } from './Meters'
import { OutpostVideo } from './OutpostVideo'
import { TelemetryFeed } from './TelemetryFeed'
import { WeatherRadar } from './WeatherRadar'
import type {
  OutpostBuiltInPanelKey,
  OutpostPanelConfig,
} from '../../schemas/project-outpost'
import {
  isBuiltInOutpostPanel,
  isVideoOutpostPanel,
} from '../../schemas/project-outpost'
import type { TelemetryEntry } from './types'
import { createTelemetryEntry } from './utils'
import './outpost.css'

type ProjectOutpostPanelProps = {
  config: OutpostPanelConfig
  title: string
}

function TelemetryFeedStandalone() {
  const [lines, setLines] = useState<TelemetryEntry[]>(() => [
    createTelemetryEntry('SYS: Telemetry channel online'),
    createTelemetryEntry('SYS: Awaiting field packets'),
  ])

  return (
    <TelemetryFeed lines={lines} onLinesChange={setLines} stream maxLines={120} />
  )
}

function renderBuiltInPanel(panel: OutpostBuiltInPanelKey, title: string) {
  switch (panel) {
    case 'weather-radar':
      return <WeatherRadar />
    case 'chart-plotter':
      return <ChartPlotter title={title} channels={['SIG-A', 'SIG-B', 'SIG-C']} />
    case 'lidar':
      return <LidarBackscatter title={title} />
    case 'meters':
      return <Meters />
    case 'telemetry':
      return <TelemetryFeedStandalone />
  }
}

export function ProjectOutpostPanel({ config, title }: ProjectOutpostPanelProps) {
  let content

  if (isBuiltInOutpostPanel(config)) {
    content = renderBuiltInPanel(config, title)
  } else if (isVideoOutpostPanel(config)) {
    content = <OutpostVideo url={config.url} />
  } else {
    content = null
  }

  if (isVideoOutpostPanel(config)) {
    return (
      <div className="outpost-tile__content outpost-tile__content--video">
        {content}
      </div>
    )
  }

  return <div className="outpost outpost-tile__content">{content}</div>
}
