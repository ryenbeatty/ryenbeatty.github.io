import { useEffect, useRef } from 'react'

export function useAnimationFrame(
  callback: (time: number) => void,
  active = true
) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!active) return

    let frame = 0
    const loop = (time: number) => {
      callbackRef.current(time)
      frame = requestAnimationFrame(loop)
    }

    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [active])
}
