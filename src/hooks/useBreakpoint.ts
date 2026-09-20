import { useEffect, useState } from "react"

function measure() {
  if (typeof window === "undefined") {
    return { sm: false, md: false, lg: false, short: false }
  }
  const width = window.innerWidth
  const height = window.innerHeight
  const phoneLandscape = width <= 932 && height <= 500
  return {
    sm: width <= 480,
    md: width <= 768 || phoneLandscape,
    lg: width <= 1024 || phoneLandscape,
    short: height <= 950,
  }
}

export function useBreakpoint() {
  const [bp, setBp] = useState(measure)

  useEffect(() => {
    const fn = () => setBp(measure())
    window.addEventListener("resize", fn)
    window.addEventListener("orientationchange", fn)
    return () => {
      window.removeEventListener("resize", fn)
      window.removeEventListener("orientationchange", fn)
    }
  }, [])

  return bp
}

export function useMobile() {
  return useBreakpoint().md
}
