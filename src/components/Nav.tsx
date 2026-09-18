import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { useBreakpoint } from "../hooks/useBreakpoint"

export default function Nav({
  onLogoClick,
  activeSection,
}: {
  onLogoClick?: () => void
  activeSection?: number
}) {
  const { sm, md: isMobile } = useBreakpoint()
  const [scrolled, setScrolled] = useState(false)
  const [pill, setPill] = useState<{ left: number; width: number; height: number; top: number } | null>(null)
  const [logoTick, setLogoTick] = useState(0)
  const prevSectionRef = useRef(activeSection)
  const containerRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => {
    if (activeSection === 0 && prevSectionRef.current !== 0) {
      setLogoTick((n) => n + 1)
    }
    prevSectionRef.current = activeSection
  }, [activeSection])

  const links = [
    { label: "About", href: "#mission", icon: "◉", sectionIdx: 1 },
    { label: "Projects", href: "#projects", icon: "□", sectionIdx: 2 },
    { label: "Skills", href: "#skills", icon: "△", sectionIdx: 3 },
    { label: "Contact", href: "#contact", icon: "✦", sectionIdx: 4 },
  ]

  useEffect(() => {
    const activeIdx = links.findIndex((l) => l.sectionIdx === activeSection)
    if (activeIdx === -1) {
      setPill(null)
      return
    }

    const el = linkRefs.current[activeIdx]
    const container = containerRef.current
    if (!el || !container) return

    const er = el.getBoundingClientRect()
    const cr = container.getBoundingClientRect()
    setPill({
      left: er.left - cr.left,
      width: er.width,
      height: er.height,
      top: er.top - cr.top,
    })
  }, [activeSection])

  if (isMobile) {
    return (
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(17,17,16,0.08)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          minHeight: 72,
        }}
      >
        {links.map((link) => {
          const isActive = activeSection === link.sectionIdx
          return (
            <a
              key={link.label}
              href={link.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                textDecoration: "none",
                fontSize: 11,
                fontWeight: 500,
                color: isActive ? "#111110" : "#9b9b98",
                transition: "color 0.2s",
                flex: 1,
                paddingTop: 12,
                paddingBottom: 10,
                minHeight: 68,
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  opacity: isActive ? 1 : 0.4,
                  transition: "opacity 0.2s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                  transform: isActive ? "scale(1.15)" : "scale(1)",
                  display: "block",
                }}
              >
                {link.icon}
              </span>
              <span>{link.label}</span>
            </a>
          )
        })}
      </nav>
    )
  }

  return (
    <nav
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        width: "min(860px, calc(100% - 32px))",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderRadius: 14,
        border: "1px solid rgba(17,17,16,0.08)",
        boxShadow: scrolled
          ? "0 8px 32px rgba(17,17,16,0.12), 0 2px 8px rgba(17,17,16,0.06)"
          : "0 2px 16px rgba(17,17,16,0.08)",
        padding: "0 24px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "box-shadow 0.3s",
      }}
    >
      <LogoCanvas triggerCount={logoTick} onClick={onLogoClick} />

      <div ref={containerRef} style={{ display: "flex", alignItems: "center", gap: 4, position: "relative" }}>
        {pill && (
          <div
            style={{
              position: "absolute",
              top: pill.top,
              left: pill.left,
              width: pill.width,
              height: pill.height,
              background: "#111110",
              borderRadius: 8,
              transition: "left 0.38s cubic-bezier(0.34,1.56,0.64,1), width 0.38s cubic-bezier(0.34,1.56,0.64,1)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
        )}
        {links.map((link, idx) => {
          const isActive = activeSection === link.sectionIdx
          return (
            <a
              key={link.label}
              ref={(el) => {
                linkRefs.current[idx] = el
              }}
              href={link.href}
              style={{
                color: isActive ? "#f8f8f6" : "#6b6b68",
                textDecoration: "none",
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                position: "relative",
                zIndex: 1,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = "#111110"
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = "#6b6b68"
              }}
            >
              {link.label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

const LOGO_TEXT = "Sean Mo"
const LOGO_HEIGHT = 36

function LogoCanvas({ triggerCount, onClick }: { triggerCount: number; onClick?: () => void }) {
  const divRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<{ t: number; spinning: boolean; spinT: number; frameId: number } | null>(null)

  useEffect(() => {
    const el = divRef.current
    if (!el) return
    const H = LOGO_HEIGHT
    let cancelled = false
    let dispose = () => {}

    const start = () => {
      if (cancelled || !el) return
      const probe = document.createElement("canvas").getContext("2d")!
      probe.font = `600 ${H * 1.1}px Fraunces, Georgia, serif`
      const W = Math.ceil(probe.measureText(LOGO_TEXT).width) + 12
      el.style.width = `${W}px`

      const tc = document.createElement("canvas")
      tc.width = W * 2
      tc.height = H * 2
      const ctx = tc.getContext("2d")!
      const texture = new THREE.CanvasTexture(tc)

      const draw = () => {
        ctx.clearRect(0, 0, tc.width, tc.height)
        ctx.font = `600 ${H * 1.1}px Fraunces, Georgia, serif`
        ctx.fillStyle = "#111110"
        ctx.textBaseline = "middle"
        ctx.textAlign = "left"
        ctx.fillText(LOGO_TEXT, 0, H)
        texture.needsUpdate = true
      }
      draw()

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      el.appendChild(renderer.domElement)
      renderer.domElement.style.display = "block"

      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 0.1, 1000)
      camera.position.z = 100

      const geo = new THREE.PlaneGeometry(W, H)
      const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
      const plane = new THREE.Mesh(geo, mat)
      scene.add(plane)

      const s = { t: 0, spinning: false, spinT: 0, frameId: 0 }
      stateRef.current = s

      const easeBack = (t: number) => {
        const c = 1.70158 * 1.525
        return t < 0.5
          ? ((2 * t) ** 2 * ((c + 1) * 2 * t - c)) / 2
          : ((2 * t - 2) ** 2 * ((c + 1) * (t * 2 - 2) + c) + 2) / 2
      }

      const tick = () => {
        s.frameId = requestAnimationFrame(tick)
        s.t += 0.016
        if (s.spinning) {
          s.spinT = Math.min(s.spinT + 0.02, 1)
          plane.rotation.y = easeBack(s.spinT) * Math.PI * 2
          if (s.spinT >= 1) {
            s.spinning = false
            s.spinT = 0
            plane.rotation.y = 0
          }
        } else {
          plane.rotation.y = Math.sin(s.t * 0.5) * 0.1
          plane.rotation.x = Math.sin(s.t * 0.3 + 1) * 0.035
        }
        renderer.render(scene, camera)
      }
      tick()

      dispose = () => {
        cancelAnimationFrame(s.frameId)
        geo.dispose()
        mat.dispose()
        texture.dispose()
        renderer.dispose()
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      }
    }

    document.fonts.ready.then(start)

    return () => {
      cancelled = true
      dispose()
    }
  }, [])

  useEffect(() => {
    if (!triggerCount || !stateRef.current) return
    stateRef.current.spinning = true
    stateRef.current.spinT = 0
  }, [triggerCount])

  return (
    <div
      ref={divRef}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick?.()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={LOGO_TEXT}
      style={{ width: 140, height: LOGO_HEIGHT, cursor: "pointer", display: "inline-flex", alignItems: "center", flexShrink: 0 }}
    />
  )
}
