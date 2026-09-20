import { useState, type CSSProperties } from "react"
import { useBreakpoint } from "../hooks/useBreakpoint"
import Eyebrow from "./Eyebrow"
import SectionHeading from "./SectionHeading"

const chip: CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  border: "1px solid rgba(17,17,16,0.14)",
  padding: "3px 10px",
  borderRadius: 100,
}

export default function Mission() {
  const { sm, md: isMobile, short } = useBreakpoint()
  const [tab, setTab] = useState(0)
  const tight = short && !isMobile

  const tabs = ["Focus", "Experience"]

  const education = {
    period: "2023 – 2027 (Expected)",
    degree: "B.Sc. Learning Design & Technology",
    institution: "Chinese University of Hong Kong (CUHK)",
    detail:
      "How people learn with technology. Final-year research on declaring AI use in writing — designed to support honesty, not punish it.",
    tags: ["Learning Design", "Educational Technology"],
  }

  const focus = [
    {
      area: "Computer Vision",
      icon: "◈",
      desc: "Training and deploying computer vision systems that operate outside the lab, from Jetson devices to live facility environments.",
      tags: ["Python", "YOLO", "OpenCV", "NVIDIA Jetson"],
    },
    {
      area: "AI Literacy",
      icon: "◉",
      desc: "Exploring how learners engage with AI, and designing systems that make that use transparent rather than hidden.",
      tags: ["Education", "Writing", "Final-year project"],
    },
    {
      area: "Human-Centred Design",
      icon: "△",
      desc: "Designing with people from the start, prioritising clarity, trust, and whether a system will actually be used.",
      tags: ["Prototyping", "Wellbeing", "Education"],
    },
  ]

  const experience = [
    {
      period: "2026 – Present",
      role: "Co-Founder & CTO",
      org: "Glowdening",
      type: "Founder",
      desc: "Product and engineering for a wellbeing companion built around overwhelm. Current focus is long-term memory — and keeping that memory private.",
    },
    {
      period: "Sep 2026 – Present",
      role: "AI Solutions Engineer",
      org: "ISS Facility Services Limited",
      type: "Contract",
      desc: "Building and evaluating computer vision prototypes for on-site use. Training detectors and running them on Jetson devices.",
    },
    {
      period: "Jun – Aug 2026",
      role: "AI & Robotics Intern",
      org: "ISS Facility Services Limited",
      type: "Internship",
      desc: "Trained detectors for smoking and falls. OCR testing, Jetson setup, vendor comparison, and an operations manual for handover.",
    },
  ]

  const panelBase: CSSProperties = {
    gridColumn: 1,
    gridRow: 1,
    minWidth: 0,
    width: "100%",
    height: "100%",
    alignSelf: "stretch",
  }

  return (
    <section
      id="mission"
      className="section-container"
      style={{
        minHeight: isMobile ? "auto" : "100svh",
        height: isMobile ? "auto" : "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: isMobile ? "visible" : "clip",
      }}
    >
      <div
        style={{
          width: "100%",
          minHeight: 0,
          maxHeight: isMobile ? undefined : "100%",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "38fr 62fr",
          gap: isMobile ? 40 : tight ? 36 : 56,
          alignItems: isMobile ? "start" : "stretch",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            minWidth: 0,
            minHeight: 0,
          }}
        >
          <Eyebrow>About me</Eyebrow>

          <SectionHeading
            style={{
              lineHeight: 1.1,
              margin: tight ? "0 0 14px" : "0 0 20px",
              fontSize: isMobile
                ? "clamp(2.1rem, 8vw, 3.2rem)"
                : "clamp(2rem, 5.2svh, 3.6rem)",
            }}
          >
            Building at the <em>intersection</em> of AI and Education.
          </SectionHeading>

          <p
            style={{
              fontSize: "clamp(14px, 1.5svh, 16px)",
              lineHeight: 1.7,
              color: "#6b6b68",
              margin: 0,
            }}
          >
            The challenge isn't whether people use AI. It's helping them use it
            responsibly, transparently, and effectively.
          </p>

          <div
            role="region"
            aria-label="Education"
            style={{
              marginTop: sm ? 28 : tight ? 22 : 32,
              paddingTop: sm ? 22 : tight ? 18 : 24,
              borderTop: "1px solid rgba(17,17,16,0.10)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#6b6b68",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Education
            </div>

            <div
              className="font-display"
              style={{
                fontSize: "clamp(1.1rem, 2.2svh, 1.35rem)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                marginBottom: 4,
                lineHeight: 1.25,
              }}
            >
              {education.degree}
            </div>

            <div
              style={{
                fontSize: "clamp(0.8rem, 1.2svh, 0.875rem)",
                color: "#6b6b68",
                marginBottom: 6,
              }}
            >
              {education.institution}
            </div>

            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "#9b9b98",
                textTransform: "uppercase",
                marginBottom: tight ? 10 : 12,
              }}
            >
              {education.period}
            </div>

            <p
              style={{
                fontSize: "clamp(0.8125rem, 1.35svh, 0.9rem)",
                lineHeight: 1.65,
                color: "#6b6b68",
                margin: "0 0 14px",
              }}
            >
              {education.detail}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {education.tags.map((tag) => (
                <span key={tag} style={chip}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            minWidth: 0,
            minHeight: 0,
            maxHeight: isMobile ? undefined : "100%",
            alignSelf: "stretch",
            border: "1px solid rgba(17,17,16,0.10)",
            display: "flex",
            flexDirection: "column",
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
                    tab === i ? "2px solid #111110" : "2px solid transparent",
                  marginBottom: -1,
                  padding: sm ? "12px 18px" : tight ? "10px 20px" : "12px 24px",
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
              display: "grid",
              alignItems: "stretch",
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <div
              id="mission-panel-0"
              role="tabpanel"
              aria-labelledby="mission-tab-0"
              aria-hidden={tab !== 0}
              inert={tab !== 0}
              style={{
                ...panelBase,
                display: isMobile && tab !== 0 ? "none" : "grid",
                visibility: isMobile || tab === 0 ? "visible" : "hidden",
                pointerEvents: tab === 0 ? "auto" : "none",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gridTemplateRows: isMobile ? "none" : "1fr",
                alignItems: "stretch",
                gap: isMobile ? 0 : 1,
                animation: tab === 0 ? "tab-in 0.22s ease" : "none",
              }}
            >
              {focus.map((f, idx) => (
                <div
                  key={f.area}
                  style={{
                    padding: sm
                      ? "20px 18px"
                      : tight
                        ? "20px 18px"
                        : "24px 22px",
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
                    gap: tight ? 10 : 12,
                    height: isMobile ? "auto" : "100%",
                    minHeight: 0,
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ fontSize: tight ? 18 : 22, lineHeight: 1 }}>
                    {f.icon}
                  </span>
                  <div
                    className="font-display"
                    style={{
                      fontSize: "clamp(1rem, 2.1svh, 1.2rem)",
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}
                  >
                    {f.area}
                  </div>
                  <p
                    style={{
                      fontSize: "clamp(0.78rem, 1.35svh, 0.875rem)",
                      lineHeight: 1.6,
                      color: "#6b6b68",
                      margin: 0,
                    }}
                  >
                    {f.desc}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: "auto" }}>
                    {f.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          ...chip,
                          fontSize: 11,
                          padding: "2px 9px",
                          border: "1px solid rgba(17,17,16,0.12)",
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
              id="mission-panel-1"
              role="tabpanel"
              aria-labelledby="mission-tab-1"
              aria-hidden={tab !== 1}
              inert={tab !== 1}
              style={{
                ...panelBase,
                display: isMobile && tab !== 1 ? "none" : "flex",
                visibility: isMobile || tab === 1 ? "visible" : "hidden",
                pointerEvents: tab === 1 ? "auto" : "none",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 0,
                padding: sm ? "0 18px" : tight ? "0 20px" : "0 24px",
                animation: tab === 1 ? "tab-in 0.22s ease" : "none",
                minHeight: 0,
              }}
            >
              {experience.map((ex, i) => (
                <div
                  key={ex.role + ex.org}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : tight ? "132px 1fr" : "150px 1fr",
                    gap: isMobile ? 8 : tight ? 20 : 28,
                    padding: sm ? "18px 0" : tight ? "14px 0" : "18px 0",
                    borderBottom:
                      i < experience.length - 1
                        ? "1px solid rgba(17,17,16,0.08)"
                        : "none",
                    minHeight: 0,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        color: "#9b9b98",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      {ex.period}
                    </div>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#6b6b68",
                        background: "rgba(17,17,16,0.05)",
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {ex.type}
                    </span>
                  </div>
                  <div>
                    <div
                      className="font-display"
                      style={{
                        fontSize: "clamp(1rem, 2.2svh, 1.3rem)",
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                        marginBottom: 2,
                      }}
                    >
                      {ex.role}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(0.78rem, 1.2svh, 0.875rem)",
                        color: "#6b6b68",
                        marginBottom: tight ? 6 : 8,
                      }}
                    >
                      {ex.org}
                    </div>
                    <p
                      style={{
                        fontSize: "clamp(0.78rem, 1.35svh, 0.875rem)",
                        lineHeight: 1.6,
                        color: "#6b6b68",
                        margin: 0,
                      }}
                    >
                      {ex.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
