import { useEffect, useRef, useState } from 'react'
import {
  buildYouTubeEmbedSrc,
  parseYouTubeEmbed,
  postYouTubeCommand,
} from '../../utils/youtube'

type OutpostVideoProps = {
  url: string
}

const VIDEO_RATIO = 16 / 9
const UI_BLEED = 1.14

function isOutpostModeActive() {
  return (
    typeof document !== 'undefined' &&
    document.documentElement.hasAttribute('data-command-center')
  )
}

function coverScale(width: number, height: number): number {
  if (width <= 0 || height <= 0) return UI_BLEED

  const containerRatio = width / height
  const cover =
    containerRatio > VIDEO_RATIO
      ? containerRatio / VIDEO_RATIO
      : VIDEO_RATIO / containerRatio

  return cover * UI_BLEED
}

function readPlayerState(data: unknown): number | null {
  if (typeof data !== 'string') return null

  try {
    const payload = JSON.parse(data) as {
      event?: string
      info?: number | { playerState?: number }
    }

    if (payload.event === 'onStateChange' && typeof payload.info === 'number') {
      return payload.info
    }

    if (
      payload.event === 'infoDelivery' &&
      typeof payload.info === 'object' &&
      payload.info &&
      typeof payload.info.playerState === 'number'
    ) {
      return payload.info.playerState
    }
  } catch {
    return null
  }

  return null
}

export function OutpostVideo({ url }: OutpostVideoProps) {
  const embed = parseYouTubeEmbed(url)
  const frameWrapRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!embed) return

    const syncSrc = () => {
      if (isOutpostModeActive()) {
        setSrc(buildYouTubeEmbedSrc(embed))
        return
      }

      setSrc(null)
      if (iframeRef.current) {
        iframeRef.current.src = 'about:blank'
      }
    }

    syncSrc()
    document.addEventListener('command-center-change', syncSrc)
    return () => document.removeEventListener('command-center-change', syncSrc)
  }, [embed?.videoId, embed?.startSeconds, url])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || !src || !embed) return

    const startAt = embed.startSeconds ?? 0

    const enforcePlayback = () => {
      postYouTubeCommand(iframe, 'mute')
      postYouTubeCommand(iframe, 'playVideo')
    }

    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return

      const state = readPlayerState(event.data)
      if (state === 0) {
        postYouTubeCommand(iframe, 'seekTo', [startAt, true])
        postYouTubeCommand(iframe, 'playVideo')
      } else if (state === 2) {
        postYouTubeCommand(iframe, 'playVideo')
      }
    }

    iframe.addEventListener('load', enforcePlayback)
    enforcePlayback()
    window.addEventListener('message', onMessage)

    const kick = window.setInterval(enforcePlayback, 500)
    const stopKick = window.setTimeout(() => window.clearInterval(kick), 2500)

    return () => {
      iframe.removeEventListener('load', enforcePlayback)
      window.removeEventListener('message', onMessage)
      window.clearInterval(kick)
      window.clearTimeout(stopKick)
    }
  }, [src, embed?.startSeconds, embed?.videoId])

  useEffect(() => {
    const wrap = frameWrapRef.current
    const iframe = iframeRef.current
    if (!wrap || !iframe || !src) return

    const applyCover = () => {
      const { width, height } = wrap.getBoundingClientRect()
      const scale = coverScale(width, height)
      iframe.style.transform = `translate(-50%, -47%) scale(${scale})`
    }

    applyCover()

    const observer = new ResizeObserver(applyCover)
    observer.observe(wrap)

    return () => observer.disconnect()
  }, [src])

  if (!embed) {
    return (
      <div className="outpost-video outpost-video--error" aria-hidden="true">
        <style>{`
          .outpost-video--error {
            width: 100%;
            height: 100%;
            min-height: inherit;
            background: #000;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="outpost-video" aria-hidden="true">
      <div className="outpost-video__frame-wrap" ref={frameWrapRef}>
        {src ? (
          <iframe
            ref={iframeRef}
            className="outpost-video__frame"
            src={src}
            title=""
            tabIndex={-1}
            loading="eager"
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : null}
        <div className="outpost-video__shield" aria-hidden="true" />
      </div>
      <style>{`
        .outpost-video {
          width: 100%;
          height: 100%;
          min-height: inherit;
          background: #000;
        }

        .outpost-video__frame-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: inherit;
          overflow: hidden;
          background: #000;
        }

        .outpost-video__frame {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border: 0;
          pointer-events: none;
          transform: translate(-50%, -47%);
          transform-origin: center center;
        }

        .outpost-video__shield {
          position: absolute;
          inset: 0;
          z-index: 1;
          cursor: default;
          background: transparent;
        }
      `}</style>
    </div>
  )
}
