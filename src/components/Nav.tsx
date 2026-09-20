import { useEffect, useRef, useState } from "react"
import { useBreakpoint } from "../hooks/useBreakpoint"

export default function Nav({
  onLogoClick,
  activeSection,
}: {
  onLogoClick?: () => void
  activeSection?: number
}) {
  const { md: isMobile } = useBreakpoint()
  const [scrolled, setScrolled] = useState(false)
  const [logoTick, setLogoTick] = useState(0)
  const prevSectionRef = useRef(activeSection)

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

  const mobileLinks = [
    { label: "Home", href: "#hero", icon: "○", sectionIdx: 0 },
    ...links,
  ]

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
          touchAction: "manipulation",
        }}
      >
        {mobileLinks.map((link) => {
          const isActive = activeSection === link.sectionIdx
          return (
            <a
              key={link.label}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(link.href.slice(1))?.scrollIntoView({ behavior: "smooth" })
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                textDecoration: "none",
                fontSize: 10,
                fontWeight: 500,
                color: isActive ? "#111110" : "#9b9b98",
                transition: "color 0.2s",
                flex: 1,
                minWidth: 0,
                paddingTop: 10,
                paddingBottom: 8,
                minHeight: 64,
                touchAction: "manipulation",
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
        left: 0,
        right: 0,
        zIndex: 200,
        pointerEvents: "none",
      }}
    >
      <div
        className="page-container"
        style={{
          pointerEvents: "auto",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderRadius: 14,
          boxShadow: scrolled
            ? "0 0 0 1px rgba(17,17,16,0.08), 0 8px 32px rgba(17,17,16,0.12), 0 2px 8px rgba(17,17,16,0.06)"
            : "0 0 0 1px rgba(17,17,16,0.08), 0 2px 16px rgba(17,17,16,0.08)",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "box-shadow 0.3s",
        }}
      >
        <LogoMark key={logoTick} onClick={onLogoClick} />

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {links.map((link) => {
            const isActive = activeSection === link.sectionIdx
            return (
              <a
                key={link.label}
                href={link.href}
                className={isActive ? "nav-link is-active" : "nav-link"}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

const LOGO_TEXT = "Sean Mo"

function LogoMark({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="nav-logo"
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
    >
      {LOGO_TEXT}
    </div>
  )
}
