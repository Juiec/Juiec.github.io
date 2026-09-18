import { useState } from "react"
import { useBreakpoint } from "../hooks/useBreakpoint"
import Eyebrow from "./Eyebrow"
import SectionHeading from "./SectionHeading"

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

function ProjectMedia({ image, gif, alt }: Pick<Project, "image" | "gif"> & { alt: string }) {
  if (!image) {
    return <div className="project-media project-media--empty" aria-hidden />
  }

  return (
    <div className="project-media">
      <img src={image} alt={alt} loading="lazy" decoding="async" />
      {gif && (
        <img
          src={gif}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="project-media-gif"
        />
      )}
    </div>
  )
}

const PROJECTS: Project[] = [
  {
    title: "Glowdening",
    year: "2026",
    desc: "A daily OS and wellbeing companion I lead as Co-Founder and CTO — built to help people manage overwhelm and shape a day that can actually be lived. Long-term memory and RAG are in active prototyping.",
    tech: ["RAG", "Local LLM", "Supabase"],
    tag: "Product",
    image: "/cards/glowdeningAI.png",
    link: "https://glowdening-ai.vercel.app/",
  },
  {
    title: "ISS Computer Vision",
    year: "2026",
    desc: "Custom YOLO models and OpenCV pipelines for various object detection tasks, trained, evaluated, and run on NVIDIA Jetson edge devices at ISS Facility Services.",
    tech: ["Python", "YOLO", "OpenCV", "NVIDIA Jetson"],
    tag: "Edge AI",
    image: "/cards/SmokingDetection.jpg",
  },
  {
    title: "VEX Robotics — CUHK",
    year: "2024–2025",
    desc: "Lead programmer for CUHK's competitive robotics team. Ranked 17th among 249 teams at the 2025 VEX Robotics World Championship, using C++ with PROS, LemLib, PID, and Pure Pursuit.",
    tech: ["C++", "PROS", "LemLib", "PID", "Pure Pursuit"],
    tag: "Robotics",
    image: "/cards/VEXRobotics.png",
    link: "https://www4.mae.cuhk.edu.hk/newsnawards/robot-skills-champion-at-the-2024-2025-vex-robotics-competition-asia-open-finals/",
  },
  {
    title: "Figure Skating AI",
    year: "Academic",
    desc: "Proposed an AI-assisted judging workflow using pose estimation and anonymized 3D skeletal representations. Researched VideoPose3D and a conceptual multi-camera pipeline for more consistent technical scoring.",
    tech: ["Python", "VideoPose3D", "Pose Estimation"],
    tag: "Research",
    image: "/cards/figure_skating_jump.gif",
  },
  {
    title: "Trust-Based Writing Toolkit",
    year: "2025–2027",
    desc: "In-progress final-year project: a non-punitive AI writing declaration toolkit for responsible authorship, AI literacy, and academic integrity.",
    tech: ["FYP", "AI Literacy", "EdTech"],
    tag: "In progress · FYP",
  },
]

export default function Projects() {
  const { sm, md: isMobile, lg: isTablet } = useBreakpoint()
  const [showAll, setShowAll] = useState(false)

  const cols = isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)"
  const collapsedHeight = sm ? 640 : isMobile ? 760 : isTablet ? 520 : 420

  return (
    <section
      id="projects"
      style={{
        padding: sm ? "72px 20px 100px" : isMobile ? "90px 28px 100px" : "100px 64px 64px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "flex-end",
          marginBottom: isMobile ? 28 : 48,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 16 : 12,
        }}
      >
        <div>
          <Eyebrow>Selected Work</Eyebrow>
          <SectionHeading style={{ margin: 0 }}>Projects</SectionHeading>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            fontSize: 13,
            color: "#6b6b68",
            background: "none",
            border: "1px solid rgba(17,17,16,0.15)",
            borderRadius: 8,
            cursor: "pointer",
            padding: isMobile ? "12px 0" : "8px 16px",
            width: isMobile ? "100%" : "auto",
            letterSpacing: "0.02em",
          }}
        >
          {showAll ? "Show Less ↑" : "All Projects →"}
        </button>
      </div>

      <div
        style={{
          maxHeight: showAll ? "2000px" : `${collapsedHeight}px`,
          overflow: "clip",
          transition: "max-height 0.8s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div
          className="projects-grid"
          style={{ gridTemplateColumns: cols }}
        >
          {PROJECTS.map((p, index) => {
            const hidden = !showAll && index >= 3
            return (
              <article
                key={p.title}
                className="card"
                style={{
                  borderRadius: 16,
                  padding: sm ? "24px 20px" : "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                  opacity: hidden ? 0 : 1,
                  transform: hidden ? "translateY(40px)" : "translateY(0)",
                  pointerEvents: hidden ? "none" : "auto",
                  transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 0.08}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(17,17,16,0.12)"
                  e.currentTarget.style.transform = hidden ? "translateY(40px)" : "translateY(-3px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(17,17,16,0.04)"
                  e.currentTarget.style.transform = hidden ? "translateY(40px)" : "translateY(0)"
                }}
              >
                <ProjectMedia image={p.image} gif={p.gif} alt={p.title} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#6b6b68",
                      background: "rgba(17,17,16,0.05)",
                      padding: "4px 10px",
                      borderRadius: 6,
                    }}
                  >
                    {p.tag}
                  </span>
                  <span style={{ fontSize: 13, color: "#6b6b68", flexShrink: 0 }}>{p.year}</span>
                </div>

                <h3
                  className="font-display"
                  style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)", fontWeight: 400, letterSpacing: "-0.01em", margin: "0 0 12px" }}
                >
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                      }}
                    >
                      {p.title}
                    </a>
                  ) : (
                    p.title
                  )}
                </h3>

                <p
                  className="project-desc"
                  style={{
                    fontSize: "clamp(0.875rem, 1vw, 0.9375rem)",
                    lineHeight: 1.7,
                    color: "#6b6b68",
                    margin: "0 0 24px",
                    flexGrow: 1,
                    opacity: 0,
                    maxHeight: 0,
                    overflow: "hidden",
                    transition: "opacity 0.3s ease, max-height 0.3s ease",
                  }}
                >
                  {p.desc}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        border: "1px solid rgba(17,17,16,0.15)",
                        padding: "3px 10px",
                        borderRadius: 100,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
