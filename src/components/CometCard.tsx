import { useEffect, useRef, type ReactNode, type RefObject } from "react"

type CometCardProps = {
  children: ReactNode
  className?: string
  root?: RefObject<HTMLElement | null>
  rotateDepth?: number
  translateDepth?: number
  visible?: boolean
}

export default function CometCard({
  children,
  className = "",
  root,
  rotateDepth = 8,
  translateDepth = 22,
  visible = true,
}: CometCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card || !visible) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let px = 0.5
    let py = 0.5
    let rx = 0
    let ry = 0
    let tx = 0
    let ty = 0
    let gx = 50
    let gy = 50
    let raf = 0

    const onMove = (e: PointerEvent) => {
      const frame = root?.current ?? card.parentElement
      if (!frame) return
      const rect = frame.getBoundingClientRect()
      px = (e.clientX - rect.left) / Math.max(rect.width, 1)
      py = (e.clientY - rect.top) / Math.max(rect.height, 1)
    }

    const tick = () => {
      const nx = (px - 0.5) * 2
      const ny = (py - 0.5) * 2
      const tr = 0.12
      rx += (ny * rotateDepth - rx) * tr
      ry += (-nx * rotateDepth - ry) * tr
      tx += (nx * translateDepth - tx) * tr
      ty += (ny * translateDepth - ty) * tr
      gx += ((px * 100) - gx) * tr
      gy += ((py * 100) - gy) * tr
      card.style.setProperty("--rx", `${rx}deg`)
      card.style.setProperty("--ry", `${ry}deg`)
      card.style.setProperty("--tx", `${tx}px`)
      card.style.setProperty("--ty", `${ty}px`)
      card.style.setProperty("--gx", `${gx}%`)
      card.style.setProperty("--gy", `${gy}%`)
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener("pointermove", onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
    }
  }, [visible, root, rotateDepth, translateDepth])

  return (
    <div className={`comet-card-scene ${visible ? "is-visible" : ""} ${className}`.trim()}>
      <div className="comet-card" ref={cardRef} aria-hidden={!visible}>
        {children}
        <span className="comet-card-glare" aria-hidden />
      </div>
    </div>
  )
}
