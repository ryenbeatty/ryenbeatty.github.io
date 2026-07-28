export type YouTubeEmbed = {
  videoId: string
  startSeconds?: number
}

export function parseYouTubeEmbed(url: string): YouTubeEmbed | null {
  try {
    const parsed = new URL(url)

    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.replace(/^\//, '').split('/')[0]
      if (!videoId) return null
      return {
        videoId,
        startSeconds: readStartSeconds(parsed.searchParams.get('t')),
      }
    }

    if (
      parsed.hostname.endsWith('youtube.com') ||
      parsed.hostname.endsWith('youtube-nocookie.com')
    ) {
      if (parsed.pathname === '/watch') {
        const videoId = parsed.searchParams.get('v')
        if (!videoId) return null
        return {
          videoId,
          startSeconds: readStartSeconds(parsed.searchParams.get('t')),
        }
      }

      const embedMatch = parsed.pathname.match(/^\/embed\/([^/?]+)/)
      if (embedMatch?.[1]) {
        return {
          videoId: embedMatch[1],
          startSeconds: readStartSeconds(parsed.searchParams.get('start')),
        }
      }

      const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/?]+)/)
      if (shortsMatch?.[1]) {
        return {
          videoId: shortsMatch[1],
          startSeconds: readStartSeconds(parsed.searchParams.get('t')),
        }
      }
    }
  } catch {
    return null
  }

  return null
}

function readStartSeconds(value: string | null): number | undefined {
  if (!value) return undefined

  if (/^\d+$/.test(value)) {
    return Number(value)
  }

  const match = value.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/)
  if (!match) return undefined

  const hours = Number(match[1] ?? 0)
  const minutes = Number(match[2] ?? 0)
  const seconds = Number(match[3] ?? 0)
  const total = hours * 3600 + minutes * 60 + seconds

  return total > 0 ? total : undefined
}

export function buildYouTubeEmbedSrc(embed: YouTubeEmbed): string {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    controls: '0',
    disablekb: '1',
    fs: '0',
    iv_load_policy: '3',
    modestbranding: '1',
    rel: '0',
    playsinline: '1',
    cc_load_policy: '0',
    enablejsapi: '1',
    origin: typeof window !== 'undefined' ? window.location.origin : '',
  })

  if (embed.startSeconds) {
    params.set('start', String(embed.startSeconds))
  }

  return `https://www.youtube-nocookie.com/embed/${embed.videoId}?${params.toString()}`
}

export function postYouTubeCommand(
  iframe: HTMLIFrameElement,
  func: string,
  args: unknown[] = [],
) {
  iframe.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func, args }),
    '*',
  )
}
