import { useBreakpoint } from "../hooks/useBreakpoint"
import Eyebrow from "./Eyebrow"

export default function Hero() {
  const { sm, md: isMobile, short: isShort } = useBreakpoint()
  return (
    <section
      id="hero"
      style={{
        minHeight: "100svh",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : isShort ? "55% 45%": "1fr 1fr",
        alignItems: "center",
        padding: sm ? "72px 20px 100px" : isMobile ? "90px 28px 100px" : "100px 64px 64px",
        maxWidth: 1200,
        margin: "0 auto",
        textAlign: isMobile ? "center" : "left",
      }}
    >
      <div>
        <p
          className="font-display"
          style={{
            fontSize: sm ? 20 : 22,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            margin: "0 0 8px",
          }}
        >
          Sean Mo
        </p>
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
            marginBottom: sm ? 28 : 40,
            marginInline: isMobile ? "auto" : undefined,
          }}
        >
          I build AI systems that are practical, explainable, and designed for
          real educational environments. My work spans AI literacy, computer
          vision, and human-centered design.
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
            Read Research
          </a>
        </div>
      </div>
    </section>
  )
}
