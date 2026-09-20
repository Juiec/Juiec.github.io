import { useBreakpoint } from "../hooks/useBreakpoint"
import Eyebrow from "./Eyebrow"

export default function Hero() {
  const { sm, md: isMobile, short: isShort } = useBreakpoint()
  return (
    <section
      id="hero"
      className="section-container"
      style={{
        minHeight: isMobile
          ? "calc(100svh - 72px - env(safe-area-inset-bottom, 0px))"
          : "100svh",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : isShort ? "55% 45%": "1fr 1fr",
        alignItems: "center",
        textAlign: isMobile ? "center" : "left",
      }}
    >
      <div style={{ minWidth: 0, width: "100%" }}>
        
        <Eyebrow>AI Engineer</Eyebrow>
        <h1
          className="font-display"
          style={{
            fontSize: sm ? "clamp(34px,10vw,52px)" : isMobile ? "clamp(38px,8vw,60px)" : "clamp(36px,6vw,84px)",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: "0 0 20px",
            wordWrap: "break-word",
          }}
        >
          Bridging AI
          <br />
          with{" "}
          <span style={{ fontWeight: 600, fontStyle: "italic", position: "relative", display: "inline-block" }}>
            Education
            <span
              style={{
                position: "absolute",
                bottom: 4,
                left: 0,
                right: 0,
                height: 10,
                background: "#e8ff5a",
                zIndex: -1,
                borderRadius: 2,
                transform: "skewX(-4deg)",
              }}
            />
          </span>
          <br />& Technology.
        </h1>
        <p
          style={{
            fontSize: "clamp(15px, 1.2vw, 17px)",
            lineHeight: 1.7,
            color: "#6b6b68",
            maxWidth: isMobile ? "100%" : 380,
            width: isMobile ? "100%" : undefined,
            marginBottom: sm ? 28 : 40,
            marginInline: isMobile ? "auto" : undefined,
            overflowWrap: "break-word",
          }}
        >
          Building AI systems that are practical, explainable, and designed
          for real educational environments. Focused on AI literacy, computer
          vision, and human-centred design.
        </p>
        <div
          style={{
            display: "flex",
            gap: sm ? 8 : 12,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          <a href="#projects" className="btn-primary" style={{ width: isMobile ? "100%" : "auto", textAlign: "center" }}>
            View work
          </a>
          <a href="#contact" className="btn-outline" style={{ width: isMobile ? "100%" : "auto", textAlign: "center" }}>
            Get in touch
          </a>
        </div>
      </div>
    </section>
  )
}
