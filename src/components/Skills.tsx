import { useRef, type PointerEvent } from "react"
import { useBreakpoint } from "../hooks/useBreakpoint"
import Eyebrow from "./Eyebrow"
import SectionHeading from "./SectionHeading"

const SLOW_RATE = 0.22

const ROWS = [
  { items: ["Python", "C++", "JavaScript", "TypeScript", "Next.js", "Tailwind", "Java"], cls: "marquee-left" },
  { items: ["YOLO", "YOLOE", "OpenCV", "NVIDIA Jetson", "Pose Estimation", "OCR", "Computer Vision"], cls: "marquee-right" },
  { items: ["RAG", "Llama.cpp", "Unsloth", "DeepSeek", "OpenAI API", "Prompt Engineering", "Local LLM"], cls: "marquee-left-slow" },
  { items: ["PROS", "LemLib", "PID", "Pure Pursuit", "Sensor Fusion", "Git", "NumPy"], cls: "marquee-right-slow" },
  { items: ["Supabase", "AI Literacy", "EdTech", "Learning Design", "Responsible AI", "Pandas", "matplotlib"], cls: "marquee-left" },
]

function MarqueeTracks() {
  return (
    <>
      {ROWS.map(({ items, cls }, ri) => (
        <div key={ri} className={`marquee-track ${cls}`}>
          {[...items, ...items, ...items].map((skill, i) => (
            <div key={`${ri}-${i}`} className="marquee-item">
              <span className="skill-word">{skill}</span>
              <span className="skill-dot">•</span>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

function SkillMarquee() {
  const rootRef = useRef<HTMLDivElement>(null)

  const setSpot = (e: PointerEvent<HTMLDivElement>) => {
    const el = rootRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`)
  }

  const setRate = (rate: number) => {
    const el = rootRef.current
    if (!el) return
    for (const anim of el.getAnimations({ subtree: true })) {
      anim.playbackRate = rate
    }
  }

  const onEnter = (e: PointerEvent<HTMLDivElement>) => {
    const el = rootRef.current
    if (!el) return
    setSpot(e)
    el.classList.add("is-spotlit")
    setRate(SLOW_RATE)
  }

  const onLeave = () => {
    const el = rootRef.current
    if (!el) return
    el.classList.remove("is-spotlit")
    setRate(1)
  }

  return (
    <div
      ref={rootRef}
      className="skills-marquee"
      onPointerEnter={onEnter}
      onPointerMove={setSpot}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
    >
      <div className="skills-marquee-ghost">
        <MarqueeTracks />
      </div>
      <div className="skills-marquee-lit" aria-hidden="true">
        <MarqueeTracks />
      </div>
    </div>
  )
}

export default function Skills() {
  const { sm, md: isMobile } = useBreakpoint()
  return (
    <section
      id="skills"
      style={{
        overflow: "clip",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: isMobile ? "auto" : "clamp(760px, 92vh, 980px)",
        paddingBlock: sm ? "72px 100px" : isMobile ? "90px 100px" : "100px 64px",
      }}
    >
      <div
        className="page-container"
        style={{
          marginBottom: isMobile ? 32 : 36,
        }}
      >
        <Eyebrow>Capabilities</Eyebrow>
        <SectionHeading>Skills</SectionHeading>
      </div>
      <SkillMarquee />
    </section>
  )
}
