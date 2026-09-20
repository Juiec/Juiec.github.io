import { Fragment, type MouseEvent } from "react"
import { useBreakpoint } from "../hooks/useBreakpoint"
import Eyebrow from "./Eyebrow"
import SectionHeading from "./SectionHeading"

const RESUME_URL = `${import.meta.env.BASE_URL}resume.pdf`
const RESUME_FILENAME = "Sean_Mo_Resume.pdf"

async function downloadResume(event: MouseEvent<HTMLAnchorElement>) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
  event.preventDefault()
  const href = event.currentTarget.href
  try {
    const res = await fetch(href)
    if (!res.ok) throw new Error(String(res.status))
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = RESUME_FILENAME
    link.click()
    URL.revokeObjectURL(url)
  } catch {
    window.open(href, "_blank", "noopener,noreferrer")
  }
}

function InkLine() {
  return (
    <svg width="100%" height="10" viewBox="0 0 400 10" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      <path
        d="M0,5 C25,3.2 55,7 95,4.8 C135,2.6 165,7.4 210,5.2 C255,3 285,7.6 325,4.6 C358,2.2 382,6.2 400,5"
        stroke="rgba(17,17,16,0.22)"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SiteFooter({ locked }: { locked: boolean }) {
  const { md: isMobile } = useBreakpoint()

  return (
    <footer
      aria-hidden={!locked}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: isMobile ? "calc(72px + env(safe-area-inset-bottom, 0px))" : 0,
        zIndex: 90,
        background: "#f8f8f6",
        opacity: locked ? 1 : 0,
        pointerEvents: locked ? "auto" : "none",
        transform: locked ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <InkLine />
      <div
        className="page-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          paddingBlock: "12px 18px",
        }}
      >
        <span className="font-display" style={{ fontSize: 15, fontWeight: 600 }}>Sean Mo</span>
        <span style={{ fontSize: 12, color: "#6b6b68" }}>© 2026 — AI Engineer</span>
      </div>
    </footer>
  )
}

export default function Contact() {
  const { sm, md: isMobile, lg: isTablet } = useBreakpoint()

  const socials = [
    { label: "GitHub", handle: import.meta.env.VITE_GITHUB_HANDLE, href: import.meta.env.VITE_GITHUB_URL },
    { label: "LinkedIn", handle: import.meta.env.VITE_LINKEDIN_HANDLE, href: import.meta.env.VITE_LINKEDIN_URL },
  ]

  const actions = [
    {
      label: "Email Me",
      description: import.meta.env.VITE_EMAIL,
      href: `mailto:${import.meta.env.VITE_EMAIL}`,
      icon: "✉",
    },
    {
      label: "WhatsApp Chat",
      description: import.meta.env.VITE_WHATSAPP_NUMBER,
      href: import.meta.env.VITE_WHATSAPP_URL,
      icon: "◎",
    },
    {
      label: "Download Resume",
      description: "PDF · Updated Sep 2026",
      href: RESUME_URL,
      icon: "↓",
      download: RESUME_FILENAME,
    },
  ]

  return (
    <section
      id="contact"
      style={{
        minHeight: isMobile
          ? "calc(100svh - 72px - env(safe-area-inset-bottom, 0px))"
          : "100svh",
        display: "flex",
        flexDirection: "column",
        overflow: "clip",
        paddingBottom: 64,
      }}
    >
      {/* Main content */}
      <div
        className="page-container"
        style={{
          paddingBlock: sm ? "72px 24px" : isMobile ? "90px 28px" : "100px 32px",
        }}
      >
        <Eyebrow>Let's talk</Eyebrow>
        <SectionHeading style={{ margin: sm ? "0 0 28px" : "0 0 30px", fontSize: "clamp(3rem, 4vw, 5.2rem)" }}>Get in touch</SectionHeading>

        <div
          className="contact-grid"
          style={{
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 36 : isTablet ? 48 : 80,
            alignItems: "start",
          }}
        >
          {/* Left — intro + social links */}
          <div>
            <p style={{ fontSize: sm ? 14 : "clamp(14px, 1.25vw, 16px)", lineHeight: 1.8, color: "#6b6b68", marginBottom: sm ? 24 : 28, maxWidth: 360 }}>
              Currently open to AI Engineering roles in EdTech and Computer Vision.
              If you're building something in that space, I'd love to hear about it.
            </p>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {socials.map((s, i) => (
                <Fragment key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textDecoration: "none",
                      padding: sm ? "16px 0" : "20px 0",
                      transition: "opacity 0.18s",
                      color: "inherit",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.5")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                  >
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6b68", marginBottom: 2 }}>
                        {s.label}
                      </div>
                      <div style={{ fontSize: sm ? 13 : 15 }}>{s.handle}</div>
                    </div>
                    <span style={{ fontSize: 13, opacity: 0.45 }}>↗</span>
                  </a>
                  <InkLine />
                </Fragment>
              ))}
            </div>
          </div>

          {/* Right — action cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {actions.map((a) => (
              <a
                key={a.label}
                href={a.href}
                {...(a.download
                  ? { download: a.download, onClick: downloadResume }
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="action-card"
                style={{ padding: sm ? "20px 20px" : "clamp(18px, 1.8vw, 28px) clamp(20px, 2vw, 28px)" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1, opacity: 0.35 }}>
                    {a.icon}
                  </span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 2 }}>{a.label}</div>
                    <div style={{ fontSize: 13, color: "#6b6b68" }}>{a.description}</div>
                  </div>
                </div>
                <span style={{ fontSize: 14, opacity: 0.35, flexShrink: 0 }}>↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
