import {
  useState,
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent,
} from "react"
import Nav from "./components/Nav"
import Hero from "./components/Hero"
import Mission from "./components/Mission"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import Contact, { SiteFooter } from "./components/Contact"
import { useMobile } from "./hooks/useBreakpoint"

// ─── Grid background ─────────────────────────────────────────────────────────
function GridBackground() {
  const [hovering, setHovering] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const mask = `radial-gradient(circle at ${cursor.x}px ${cursor.y}px, #000 80px, transparent 140px)`

  const shared: CSSProperties = {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
    backgroundSize: "40px 40px",
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      onPointerEnter={() => setHovering(true)}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setHovering(false)}
    >
      <div
        style={{
          ...shared,
          backgroundImage:
            "linear-gradient(rgba(17,17,16,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,16,0.06) 1px, transparent 1px)",
        }}
      />
      <div
        style={{
          ...shared,
          backgroundImage:
            "linear-gradient(rgba(17,17,16,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,16,0.14) 1px, transparent 1px)",
          opacity: hovering ? 1 : 0,
          maskImage: mask,
          WebkitMaskImage: mask,
          transition: "opacity 0.2s",
        }}
      />
    </div>
  )
}

// ─── 3D Wireframe Cube ───────────────────────────────────────────────────────
function WireframeCube() {
  const faces = ["front", "back", "left", "right", "top", "bottom"]
  const stars = [
    { top: "8%",    left: "10%",  delay: "0s"   },
    { top: "15%",  right: "12%",  delay: "0.8s" },
    { bottom: "18%", left: "8%", delay: "1.4s" },
    { bottom: "10%", right: "15%", delay: "0.4s" },
    { top: "40%",   left: "4%",   delay: "1.8s" },
    { top: "30%",  right: "6%",   delay: "1.1s" },
  ]

  return (
    <div className="wireframe-scene" style={{ width: 384, height: 384, position: "relative" }}>
      {stars.map(({ delay, ...pos }, i) => (
        <span key={i} className="star" style={{ ...(pos as CSSProperties), animationDelay: delay }}>
          ✦
        </span>
      ))}
      <div className="wireframe-center">
        <div className="wireframe-orbit" style={{ width: 520, height: 520, border: "1.5px solid rgba(17,17,16,0.28)", animation: "orbit-a 10s linear infinite" }} />
        <div className="wireframe-orbit" style={{ width: 460, height: 460, border: "1px solid rgba(17,17,16,0.18)", animation: "orbit-b 17s linear infinite" }} />
        <div className="wireframe-cube">
          {faces.map((f) => (
            <div key={f} className={`wireframe-face face-${f}`}>
              <div className="face-inner">
                {Array.from({ length: 9 }).map((_, i) => <span key={i} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Scrolling cube ───────────────────────────────────────────────────────────
function ScrollingCube() {
  const isMobile = useMobile()
  const [smoothProgress, setSmoothProgress] = useState(0)
  const rawProgress = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight || 800
      rawProgress.current = Math.min(window.scrollY / (vh * 0.7), 1)
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    const tick = () => {
      setSmoothProgress((prev) => {
        const next = prev + (rawProgress.current - prev) * 0.07
        return Math.abs(next - rawProgress.current) < 0.0001 ? rawProgress.current : next
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const eased =
    smoothProgress < 0.5
      ? 4 * smoothProgress ** 3
      : 1 - (-2 * smoothProgress + 2) ** 3 / 2

  const scale = 1 + eased * 2.6
  const opacity = isMobile ? 0 : 1.0 - eased * 0.77
  const translateX = -8 + eased * 30

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: isMobile ? "80%" : "54%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 0,
        transform: `translateX(${translateX}%) scale(${scale})`,
        opacity,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      }}
    >
      <WireframeCube />
    </div>
  )
}

// ─── Scroll snap engine ───────────────────────────────────────────────────────
const SNAP_SECTIONS = ["hero", "mission", "projects", "skills", "contact"]

function playSnap() {
  try {
    type AC = typeof AudioContext
    const Ctx: AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: AC }).webkitAudioContext
    const ctx = new Ctx()
    const now = ctx.currentTime

    // Soft sine thump — low, padded, gentle
    const osc = ctx.createOscillator(); osc.type = "sine"
    osc.frequency.setValueAtTime(200, now)
    osc.frequency.exponentialRampToValueAtTime(85, now + 0.14)
    const oscG = ctx.createGain()
    oscG.gain.setValueAtTime(0, now)
    oscG.gain.linearRampToValueAtTime(0.28, now + 0.006)
    oscG.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
    osc.connect(oscG); oscG.connect(ctx.destination)
    osc.start(now); osc.stop(now + 0.2)

    // Airy high shimmer — barely audible breath
    const shimmer = ctx.createOscillator(); shimmer.type = "sine"; shimmer.frequency.value = 1100
    const shimG = ctx.createGain()
    shimG.gain.setValueAtTime(0, now)
    shimG.gain.linearRampToValueAtTime(0.04, now + 0.004)
    shimG.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
    shimmer.connect(shimG); shimG.connect(ctx.destination)
    shimmer.start(now); shimmer.stop(now + 0.12)

    setTimeout(() => ctx.close(), 400)
  } catch {}
}

function useScrollSnap(onSection: (i: number) => void): (idx: number) => void {
  const cbRef = useRef(onSection)
  useEffect(() => { cbRef.current = onSection })

  const goToRef = useRef<(idx: number) => void>(() => {})

  useEffect(() => {
    let busy = false
    let touchStartY = 0

    function tops() {
      return SNAP_SECTIONS.map((id) => {
        const el = document.getElementById(id)
        return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : 0
      })
    }

    function currentIndex() {
      const t = tops()
      const mid = window.scrollY + window.innerHeight * 0.35
      let idx = 0
      for (let i = 0; i < t.length; i++) if (mid >= t[i]) idx = i
      return idx
    }

    function springTo(targetY: number, onDone: () => void, endBounce = false) {
      const shell = endBounce ? document.getElementById("page-shell") : null
      let pos = window.scrollY
      let vel = endBounce ? 780 : 0
      const k = endBounce ? 300 : 310
      const b = endBounce ? 20 : 27
      let last: number | null = null
      if (shell) shell.style.willChange = "transform"

      function settle() {
        window.scrollTo(0, targetY)
        if (shell) {
          shell.style.transform = ""
          shell.style.willChange = ""
        }
        onDone()
      }

      function step(t: number) {
        if (last === null) { last = t; requestAnimationFrame(step); return }
        const dt = Math.min((t - last) / 1000, 0.05)
        last = t
        vel += (-k * (pos - targetY) - b * vel) * dt
        pos += vel * dt

        const scrollY = endBounce ? Math.max(0, Math.min(pos, targetY)) : Math.max(0, pos)
        window.scrollTo(0, scrollY)
        if (shell) {
          const overshoot = scrollY - pos
          shell.style.transform = overshoot ? `translateY(${overshoot}px)` : ""
        }

        if (Math.abs(vel) > 0.8 || Math.abs(pos - targetY) > 0.8) {
          requestAnimationFrame(step)
        } else {
          settle()
        }
      }
      requestAnimationFrame(step)
    }

    function rubberBand(sign: number, onDone: () => void) {
      const shell = document.getElementById("page-shell")
      if (!shell) { onDone(); return }
      const target: HTMLElement = shell

      let pos = 0
      let vel = sign * -720
      const k = 340
      const b = 24
      let last: number | null = null
      target.style.willChange = "transform"

      function step(t: number) {
        if (last === null) { last = t; requestAnimationFrame(step); return }
        const dt = Math.min((t - last) / 1000, 0.05)
        last = t
        vel += (-k * pos - b * vel) * dt
        pos += vel * dt
        target.style.transform = `translateY(${pos}px)`
        if (Math.abs(vel) > 0.7 || Math.abs(pos) > 0.7) {
          requestAnimationFrame(step)
        } else {
          target.style.transform = ""
          target.style.willChange = ""
          onDone()
        }
      }
      requestAnimationFrame(step)
    }

    function goTo(idx: number) {
      if (busy) return
      if (idx < 0) {
        busy = true
        rubberBand(-1, () => { busy = false })
        return
      }
      if (idx >= SNAP_SECTIONS.length) return

      const dest = tops()[idx]
      const landingOnContact = idx === SNAP_SECTIONS.length - 1
      const alreadyThere = Math.abs(window.scrollY - dest) < 12

      busy = true
      cbRef.current(idx)
      playSnap()
      springTo(dest, () => { busy = false }, landingOnContact && !alreadyThere)
    }

    goToRef.current = goTo

    function atEdge(dir: "down" | "up") {
      const idx = currentIndex()
      const el = document.getElementById(SNAP_SECTIONS[idx])
      if (!el) return true
      const sectionTop = tops()[idx]
      const sectionBottom = sectionTop + el.offsetHeight
      const pad = 6
      if (dir === "down") return window.scrollY + window.innerHeight >= sectionBottom - pad
      return window.scrollY <= sectionTop + pad
    }

    function onWheel(e: WheelEvent) {
      if (e.deltaY > 0 && atEdge("down")) {
        e.preventDefault()
        if (!busy) goTo(currentIndex() + 1)
      } else if (e.deltaY < 0 && atEdge("up")) {
        e.preventDefault()
        if (!busy) goTo(currentIndex() - 1)
      }
    }

    function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
    function onTouchEnd(e: TouchEvent) {
      if (busy) return
      const dy = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(dy) < 50) return
      if (dy > 0 && atEdge("down")) goTo(currentIndex() + 1)
      else if (dy < 0 && atEdge("up")) goTo(currentIndex() - 1)
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchend", onTouchEnd)
    }
  }, [])

  return (idx: number) => goToRef.current(idx)
}

const SECTION_LABELS = ["Intro", "About", "Projects", "Skills", "Contact"]

function SectionDots({ active }: { active: number }) {
  const isMobile = useMobile()
  if (isMobile) return null
  return (
    <div
      style={{
        position: "fixed",
        right: 28,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        zIndex: 200,
      }}
    >
      {SNAP_SECTIONS.map((id, i) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={SECTION_LABELS[i]}
          onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView() }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            textDecoration: "none",
          }}
        >
          <span
            style={{
              display: "block",
              width: i === active ? 7 : 4,
              height: i === active ? 7 : 4,
              borderRadius: "50%",
              background: i === active ? "#111110" : "rgba(17,17,16,0.22)",
              transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
              boxShadow: i === active ? "0 0 0 2px rgba(17,17,16,0.12)" : "none",
            }}
          />
        </a>
      ))}
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const isMobile = useMobile()
  const [activeSection, setActiveSection] = useState(0)
  const snapTo = useScrollSnap(setActiveSection)

  // Update nav only after scrolling stops (covers nav-link clicks and logo click)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const update = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const distances = SNAP_SECTIONS.map((id) => {
          const el = document.getElementById(id)
          return el ? Math.abs(el.getBoundingClientRect().top) : Infinity
        })
        setActiveSection(distances.indexOf(Math.min(...distances)))
      }, 60)
    }
    window.addEventListener("scroll", update, { passive: true })
    return () => {
      window.removeEventListener("scroll", update)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div style={{ background: "#f8f8f6", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <GridBackground />
      <ScrollingCube />
      <SectionDots active={activeSection} />
      <Nav onLogoClick={() => snapTo(0)} activeSection={activeSection} />
      <div id="page-shell" style={{ position: "relative", zIndex: 1, paddingBottom: isMobile ? "calc(72px + env(safe-area-inset-bottom, 0px))" : 0 }}>
        <Hero />
        <Mission />
        <Projects />
        <Skills />
        <Contact />
      </div>
      <SiteFooter locked={activeSection === 4} />
    </div>
  )
}
