import { useState } from "react"
import { useBreakpoint } from "../hooks/useBreakpoint"
import Eyebrow from "./Eyebrow"
import SectionHeading from "./SectionHeading"

export default function Projects() {
  const { sm, md: isMobile, lg: isTablet } = useBreakpoint()
  const [showAll, setShowAll] = useState(false)

  const projects = [
    {
      title: "GlowdeningAI",
      year: "2026",
      desc: "Glowdening AI is a companionAI that helps users with mental health and emotional support through natural language processing and sentiment analysis.",
      tech: ["Finetuned Local LLM", "RAG", "self-hosted", "React", "Node.js"],
      tag: "Full-Stack AI Development",
      gif: "/gifs/placeholder.gif",
      link: "https://glowdening-ai.vercel.app/",
    },
    
    {
      title: "Smart Smoking Detection",
      year: "2024",
      desc: "Real-time detection using YOLOE-26 and MediaPipe pose estimation. Reduces false positives via temporal verification logic.",
      tech: ["Python", "YOLOE", "OpenCV"],
      tag: "Computer Vision",
      gif: "/gifs/placeholder.gif",
      link: "https://github.com/yourname/smoking-detection",
    },
    {
      title: "Figure Skating AI",
      year: "2024",
      desc: "AI-assisted judging system using YOLO for detection and VideoPose3D for 2D-to-3D skeleton reconstruction.",
      tech: ["Python", "VideoPose3D", "YOLO"],
      tag: "Research",
      gif: "/gifs/placeholder.gif",
      link: "https://github.com/yourname/skating-ai",
    },
    {
      title: "AI-Powered Autonomous Patrolling",
      year: "2026",
      desc: "Autonomous AI patrolling system integrating computer vision and edge AI.",
      tech: ["Python", "YOLO", "Edge AI"],
      tag: "Computer Vision",
      gif: "/gifs/placeholder.gif",
      link: "https://github.com/yourname/patrolling",
    },
    {
      title: "Trust-Based Writing Toolkit",
      year: "2025",
      desc: "A non-punitive AI writing declaration toolkit to promote responsible authorship. Focuses on AI literacy and academic integrity.",
      tech: ["FYP", "AI Literacy", "React"],
      tag: "EdTech",
      gif: "/gifs/placeholder.gif",
      link: "https://github.com/yourname/writing-toolkit",
    },
    
  ]

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
          overflow: "hidden",
          transition: "max-height 0.8s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div
          className="projects-grid"
          style={{ gridTemplateColumns: cols }}
        >
          {projects.map((p, index) => {
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
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    borderRadius: 8,
                    overflow: "hidden",
                    marginBottom: 20,
                    background: "rgba(17,17,16,0.05)",
                  }}
                >
                  <img
                    src={p.gif}
                    alt={p.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
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
                  <span style={{ fontSize: 13, color: "#6b6b68" }}>{p.year}</span>
                </div>

                <h3
                  className="font-display"
                  style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)", fontWeight: 400, letterSpacing: "-0.01em", margin: "0 0 12px" }}
                >
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