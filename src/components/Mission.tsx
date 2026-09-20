import { useState } from "react"
import { useBreakpoint } from "../hooks/useBreakpoint"
import Eyebrow from "./Eyebrow"
import SectionHeading from "./SectionHeading"

export default function Mission() {
  const { sm, md: isMobile } = useBreakpoint()
  const [tab, setTab] = useState(0)

  const tabs = ["Focus", "Experience"]

  const education = [
    {
      period: "2023 – 2027 (Expected)",
      degree: "B.Sc. Learning Design & Technology",
      institution: "Chinese University of Hong Kong (CUHK)",
      detail: "In-progress final-year project on AI writing declaration toolkits. Coursework: AI in Action, Programming, Data Analysis, Multimedia Systems, Educational Technology, and Web Design.",
      tags: ["AI Literacy", "EdTech", "Web Design"],
    },
  ]

  const focus = [
    {
      area: "Machine Learning Engineering",
      icon: "◈",
      desc: "Building production-grade CV pipelines with YOLO, OpenCV, and NVIDIA Jetson. Emphasis on real-time inference, edge deployment, and system reliability.",
      tags: ["Python", "YOLO", "OpenCV", "NVIDIA Jetson"],
    },
    {
      area: "EdTech & AI Literacy",
      icon: "◉",
      desc: "Designing tools and curricula that help students and educators engage with AI responsibly. Current FYP: a non-punitive writing declaration toolkit focused on transparency and academic integrity.",
      tags: ["Curriculum Design", "Responsible AI", "FYP"],
    },
    {
      area: "Human-Centred Design",
      icon: "△",
      desc: "Grounding AI systems in user needs through iterative prototyping and context-aware design — particularly in wellbeing and educational environments, with privacy and trust first.",
      tags: ["UX Research", "Prototyping", "Accessibility"],
    },
  ]

  const experience = [
    {
      period: "2026 – Present",
      role: "Co-Founder & CTO",
      org: "Glowdening",
      type: "Founder",
      desc: "Lead technical architecture and AI strategy for an AI-powered wellbeing companion. Prototyping long-term memory with embeddings, semantic search, and RAG, with a focus on privacy, trust, and energy-aware recommendations.",
    },
    {
      period: "Sep 2026 – Present",
      role: "AI Solutions Engineer",
      org: "ISS Facility Services Limited",
      type: "Contract",
      desc: "Developing and evaluating computer vision proof-of-concept solutions with Python, OpenCV, YOLO, and NVIDIA Jetson. Building inference pipelines, visualization, and edge deployment workflows.",
    },
    {
      period: "Jun 2026 – Aug 2026",
      role: "AI & Robotics Intern",
      org: "ISS Facility Services Limited",
      type: "Internship",
      desc: "Tested an AI OCR platform and trained custom YOLO models for smoking and fall detection. Configured Jetson environments, benchmarked vendor solutions, and authored an operations manual.",
    },
  ]

return (
  <section
    id="mission"
    className="section-container"
    style={{
      minHeight: isMobile ? "auto" : "100svh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: isMobile ? "visible" : "clip",
    }}
  >
    <div
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "35fr 65fr",
        gap: isMobile ? 48 : 64,
        alignItems: isMobile ? "start" : "stretch",
      }}
    >
      {/* Left: heading and introduction */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: isMobile ? "flex-start" : "center",
          alignSelf: "stretch",
          paddingBottom: isMobile ? 4 : 0,
        }}
      >
        <Eyebrow>About me</Eyebrow>

        <SectionHeading
          style={{
            lineHeight: 1.1,
            margin: "0 0 20px",
            fontSize: "clamp(2.3rem, 3vw, 4rem)",
          }}
        >
          Building at the <em>intersection</em> of AI and Education.
        </SectionHeading>

        <p
          style={{
            fontSize: "clamp(15px, 1.2vw, 16px)",
            lineHeight: 1.8,
            color: "#6b6b68",
            margin: 0,
          }}
        >
          The challenge isn't whether people use AI, it's helping them use it
          responsibly, transparently, and effectively. I build deployable
          systems that sit at that boundary.
        </p>
      </div>

      {/* Right: education context, then Focus / Experience */}
      <div
        style={{
          width: "100%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: isMobile ? "flex-start" : "center",
        }}
      >
        <div role="region" aria-label="Education">
          {education.map((e) => (
            <div key={e.degree}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: "#6b6b68",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Education
              </div>

              <div
                className="font-display"
                style={{
                  fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  marginBottom: 4,
                }}
              >
                {e.degree}
              </div>

              <div
                style={{
                  fontSize: "clamp(0.8rem, 0.9vw, 0.875rem)",
                  color: "#6b6b68",
                  marginBottom: 6,
                }}
              >
                {e.institution}
              </div>

              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: "#9b9b98",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                {e.period}
              </div>

              <p
                style={{
                  fontSize: "clamp(0.875rem, 1vw, 0.9375rem)",
                  lineHeight: 1.75,
                  color: "#6b6b68",
                  margin: "0 0 16px",
                  maxWidth: 560,
                }}
              >
                {e.detail}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                {e.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      border: "1px solid rgba(17,17,16,0.14)",
                      padding: "3px 10px",
                      borderRadius: 100,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          aria-hidden="true"
          style={{
            height: 1,
            background: "rgba(17,17,16,0.10)",
            margin: sm ? "28px 0" : "32px 0",
            flexShrink: 0,
          }}
        />

        <div
          style={{
            border: "1px solid rgba(17,17,16,0.10)",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <div
            role="tablist"
            aria-label="Focus and experience"
            style={{
              display: "flex",
              gap: 0,
              borderBottom: "1px solid rgba(17,17,16,0.10)",
              overflowX: isMobile ? "auto" : "visible",
              flexShrink: 0,
            }}
          >
            {tabs.map((t, i) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === i}
                aria-controls={`mission-panel-${i}`}
                id={`mission-tab-${i}`}
                onClick={() => setTab(i)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  borderBottom:
                    tab === i
                      ? "2px solid #111110"
                      : "2px solid transparent",
                  marginBottom: -1,
                  padding: sm ? "12px 18px" : "14px 28px",
                  fontSize: sm ? 13 : 14,
                  fontWeight: 500,
                  color: tab === i ? "#111110" : "#9b9b98",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "color 0.18s, border-color 0.18s",
                  letterSpacing: "0.02em",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div
            style={{
              minHeight: isMobile ? 280 : 360,
              position: "relative",
            }}
          >
            {tab === 0 && (
              <div
                id="mission-panel-0"
                role="tabpanel"
                aria-labelledby="mission-tab-0"
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                  gap: isMobile ? 0 : 1,
                  height: "100%",
                  minHeight: isMobile ? 280 : 360,
                  animation: "tab-in 0.22s ease",
                }}
              >
                {focus.map((f, idx) => (
                  <div
                    key={f.area}
                    style={{
                      padding: sm ? "24px 20px" : "32px 28px",
                      borderRight:
                        isMobile || idx === focus.length - 1
                          ? "none"
                          : "1px solid rgba(17,17,16,0.10)",
                      borderBottom:
                        isMobile && idx < focus.length - 1
                          ? "1px solid rgba(17,17,16,0.10)"
                          : "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{f.icon}</span>
                    <div className="font-display" style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.2rem)", fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                      {f.area}
                    </div>
                    <p style={{ fontSize: "clamp(0.8125rem, 0.95vw, 0.875rem)", lineHeight: 1.75, color: "#6b6b68", margin: 0, flexGrow: 1 }}>
                      {f.desc}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {f.tags.map((tag) => (
                        <span key={tag} style={{ fontSize: 11, fontWeight: 500, border: "1px solid rgba(17,17,16,0.12)", padding: "2px 9px", borderRadius: 100 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 1 && (
              <div
                id="mission-panel-1"
                role="tabpanel"
                aria-labelledby="mission-tab-1"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  minHeight: isMobile ? 280 : 360,
                  animation: "tab-in 0.22s ease",
                  padding: sm ? "0 20px" : "0 28px",
                }}
              >
                {experience.map((ex, i) => (
                  <div
                    key={ex.role + ex.org}
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "160px 1fr",
                      gap: isMobile ? 10 : 40,
                      padding: sm ? "24px 0" : "28px 0",
                      borderBottom:
                        i < experience.length - 1
                          ? "1px solid rgba(17,17,16,0.08)"
                          : "none",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: "#9b9b98", textTransform: "uppercase", marginBottom: 4 }}>
                        {ex.period}
                      </div>
                      <span style={{
                        display: "inline-block",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#6b6b68",
                        background: "rgba(17,17,16,0.05)",
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}>
                        {ex.type}
                      </span>
                    </div>
                    <div>
                      <div className="font-display" style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.4rem)", fontWeight: 400, letterSpacing: "-0.01em", marginBottom: 3 }}>
                        {ex.role}
                      </div>
                      <div style={{ fontSize: "clamp(0.8rem, 0.9vw, 0.875rem)", color: "#6b6b68", marginBottom: 10 }}>{ex.org}</div>
                      <p style={{ fontSize: "clamp(0.8125rem, 0.95vw, 0.875rem)", lineHeight: 1.75, color: "#6b6b68", margin: 0, maxWidth: 560 }}>
                        {ex.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}
