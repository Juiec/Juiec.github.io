import { useRef, type PointerEvent } from "react"
import { useBreakpoint } from "../hooks/useBreakpoint"
import Eyebrow from "./Eyebrow"
import SectionHeading from "./SectionHeading"

const SLOW_RATE = 0.22

const ROWS = [
  { items: ["Python", "C++", "JavaScript", "TypeScript", "Next.js"], cls: "marquee-left" },
  { items: ["YOLO", "OpenCV", "NVIDIA Jetson", "Pose Estimation", "OCR", "Computer Vision"], cls: "marquee-right" },
  { items: ["RAG", "Llama.cpp", "Unsloth", "DeepSeek", "OpenAI API", "Local LLM"], cls: "marquee-left-slow" },
  { items: ["PROS", "LemLib", "PID", "Pure Pursuit", "Sensor Fusion"], cls: "marquee-right-slow" },
  { items: ["Supabase", "AI Literacy", "Learning Design", "Pandas"], cls: "marquee-left" },
]

const SKILL_ITEMS = [...new Set(ROWS.flatMap((row) => row.items))]

function SkillChips() {
  return (
    <ul className="skill-chips page-container">
      {SKILL_ITEMS.map((skill) => (
        <li key={skill} className="skill-chip">
          {skill}
        </li>
      ))}
    </ul>
  )
}

function MarqueeTracks() {
  return (
    <>
      {ROWS.map(({ items, cls }, ri) => (
        <div key={ri} className={`marquee-track ${cls}`}>
          {/* Four repeats: the -50% keyframes travel exactly two cycles, so a shorter row still covers the viewport and the loop meets itself. */}
          {[...items, ...items, ...items, ...items].map((skill, i) => (
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
        paddingBlock: sm ? "72px 48px" : isMobile ? "90px 48px" : "100px 64px",
      }}
    >
      <div
        className="page-container"
        style={{
          marginBottom: isMobile ? 32 : 36,
        }}
      >
        <Eyebrow>In practice</Eyebrow>
        <SectionHeading>Skills</SectionHeading>
      </div>
      {isMobile ? <SkillChips /> : <SkillMarquee />}
    </section>
  )
}
