import { lazy, Suspense, useState } from "react"
import { useBreakpoint } from "../hooks/useBreakpoint"
import Eyebrow from "./Eyebrow"
import SectionHeading from "./SectionHeading"
import type { HoverSliderItem } from "./HoverSlider"

const HoverSlider = lazy(() => import("./HoverSlider"))

type Project = {
  title: string
  year: string
  desc: string
  tech: string[]
  tag: string
  image?: string
  gif?: string
  link?: string
}

const PROJECTS: Project[] = [
  {
    title: "Glowdening",
    year: "2026",
    desc: "A wellbeing companion for overwhelm. Led as co-founder and CTO, with long-term memory now in prototyping.",
    tech: ["RAG", "Local LLM", "Supabase"],
    tag: "Product",
    image: "/cards/glowdeningAI.png",
    link: "https://glowdening-ai.vercel.app/",
  },
  {
    title: "ISS Computer Vision",
    year: "2026",
    desc: "Computer vision for facility operations — smoking and fall detection on NVIDIA Jetson. Training, testing, and on-device setup.",
    tech: ["Python", "YOLO", "OpenCV", "NVIDIA Jetson"],
    tag: "Computer vision",
    image: "/cards/SmokingDetection.jpg",
  },
  {
    title: "VEX Robotics — CUHK",
    year: "2024–2025",
    desc: "Lead programmer for CUHK's VEX team. We placed 17th of 249 at the 2025 World Championship.",
    tech: ["C++", "PROS", "LemLib", "PID", "Pure Pursuit"],
    tag: "Robotics",
    image: "/cards/VEXRobotics.png",
    link: "https://www4.mae.cuhk.edu.hk/newsnawards/robot-skills-champion-at-the-2024-2025-vex-robotics-competition-asia-open-finals/",
  },
  {
    title: "Figure Skating AI",
    year: "Academic",
    desc: "Research on fairer technical scores in figure skating — using 3D pose estimation so judges can review technique without seeing who the skater is.",
    tech: ["Python", "VideoPose3D", "Pose Estimation"],
    tag: "Research",
    image: "/cards/figure_skating_jump.gif",
  },
  {
    title: "Trust-Based Writing Toolkit",
    year: "2025–2027",
    desc: "Final-year project: a way for students to declare AI use in writing without turning honesty into a penalty. In progress.",
    tech: ["AI Literacy", "Writing", "Education"],
    tag: "In progress · Final year",
  },
]

function assetUrl(path?: string) {
  if (!path) return ""
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`
}

const HOVER_ITEMS: HoverSliderItem[] = PROJECTS.map((project, index) => ({
  id: String(index + 1).padStart(2, "0"),
  title: project.title,
  year: project.year,
  tag: project.tag,
  desc: project.desc,
  tech: project.tech,
  img: assetUrl(project.image),
  href: project.link,
}))

function ProjectCaption({ project }: { project: Project }) {
  return (
    <>
      <div className="project-folio-meta">
        <span className="project-folio-tag">{project.tag}</span>
        <span className="project-folio-year">{project.year}</span>
      </div>
      <h3 className="font-display project-folio-title">
        {project.link ? (
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            {project.title}
            <span className="project-folio-arrow" aria-hidden>
              ↗
            </span>
          </a>
        ) : (
          project.title
        )}
      </h3>
      <p className="project-folio-desc">{project.desc}</p>
      <div className="project-folio-tech">
        {project.tech.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </>
  )
}

function MobileProjects() {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? PROJECTS : PROJECTS.slice(0, 2)

  return (
    <section id="projects" className="section-container">
      <div className="project-folio-head">
        <div>
          <Eyebrow>Selected work</Eyebrow>
          <SectionHeading style={{ margin: 0 }}>Projects</SectionHeading>
        </div>
      </div>

      <div className="project-stack">
        {visible.map((project) => (
          <article key={project.title} className="project-stack-card">
            {project.image ? (
              <img src={assetUrl(project.image)} alt={project.title} />
            ) : (
              <div className="project-media project-media--empty" aria-hidden />
            )}
            <ProjectCaption project={project} />
          </article>
        ))}
        <button
          type="button"
          className="project-stack-toggle"
          onClick={() => setShowAll((open) => !open)}
        >
          {showAll ? "Show less ↑" : "All projects →"}
        </button>
      </div>
    </section>
  )
}

export default function Projects() {
  const { md: isMobile } = useBreakpoint()
  if (isMobile) return <MobileProjects />

  return (
    <section id="projects" className="section-container project-section">
      <div className="project-folio-head">
        <div>
          <Eyebrow>Selected work</Eyebrow>
          <SectionHeading style={{ margin: 0 }}>Projects</SectionHeading>
        </div>
        <p className="project-hint">Hover a row</p>
      </div>

      <Suspense fallback={<div className="project-hover-stage" />}>
        <HoverSlider items={HOVER_ITEMS} />
      </Suspense>
    </section>
  )
}
