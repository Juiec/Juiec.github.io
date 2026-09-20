import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import * as THREE from "three"

/**
 * Curved image stack and hover-list interaction follow ObsidianUI Hover Slider
 * (https://www.obsidianui.dev/docs/interactive-hover-slider), restaged for this folio:
 * paper/ink, no chrome, canvas does not capture pointer or wheel.
 */

const VERTEX_SHADER = /* glsl */ `
uniform vec2 uVelocity;
uniform vec2 uViewport;
uniform float uCurvature;
varying vec2 vUv;

float circularArc(float d) {
  float maxAngle = 1.15;
  float theta = clamp(d, 0.0, 1.0) * maxAngle;
  return (1.0 - cos(theta)) / (1.0 - cos(maxAngle));
}

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  float nx = worldPos.x / uViewport.x;
  float ny = worldPos.y / uViewport.y;
  float cx = clamp(nx, -1.0, 1.0);
  float cy = clamp(ny, -1.0, 1.0);
  float curveY = circularArc(abs(cy));
  float curveX = circularArc(abs(cx));
  float edgeLift = curveY * uCurvature + curveX * (uCurvature * 0.1);
  float focalLength = max(uViewport.y * 2.2, 900.0);
  float perspective = focalLength / (focalLength - edgeLift);
  vec3 finalPos = worldPos.xyz;
  finalPos.xy *= perspective;
  finalPos.z += edgeLift;
  gl_Position = projectionMatrix * viewMatrix * vec4(finalPos, 1.0);
}
`

const FRAGMENT_SHADER = /* glsl */ `
uniform sampler2D uTexture;
uniform vec2 uPlaneSize;
uniform vec2 uImageSize;
uniform float uAlpha;
uniform float uZoom;
varying vec2 vUv;

vec2 coverUv(vec2 uv, vec2 planeSize, vec2 imageSize) {
  float planeRatio = planeSize.x / planeSize.y;
  float imageRatio = imageSize.x / imageSize.y;
  vec2 scale = vec2(1.0);
  if (planeRatio > imageRatio) scale.y = imageRatio / planeRatio;
  else scale.x = planeRatio / imageRatio;
  uv = (uv - 0.5) * scale + 0.5;
  return (uv - 0.5) / uZoom + 0.5;
}

void main() {
  vec2 uv = coverUv(vUv, uPlaneSize, uImageSize);
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
  vec4 tex = texture2D(uTexture, uv);
  gl_FragColor = vec4(tex.rgb, tex.a * uAlpha);
}
`

const VISIBLE = 7
const HALF = 3
const GAP = 10
const CARD_ASPECT = 1.65
const ACTIVE_CURVE = 400
const SOFT_CURVE = 80

type Ease = (t: number) => number
const power2Out: Ease = (t) => 1 - (1 - t) ** 2
const power2InOut: Ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
const power3Out: Ease = (t) => 1 - (1 - t) ** 3

type TweenHandle = { kill: () => void }

function tweenTo(
  target: Record<string, number>,
  vars: Record<string, number> & { duration: number; ease: Ease; onComplete?: () => void },
): TweenHandle {
  const { duration, ease, onComplete, ...keys } = vars
  const from: Record<string, number> = {}
  for (const key of Object.keys(keys)) from[key] = target[key] ?? 0
  let raf = 0
  let killed = false
  const t0 = performance.now()
  const step = (now: number) => {
    if (killed) return
    const p = duration <= 0 ? 1 : Math.min(1, (now - t0) / (duration * 1000))
    const e = ease(p)
    for (const key of Object.keys(keys)) {
      target[key] = from[key] + (keys[key] - from[key]) * e
    }
    if (p < 1) raf = requestAnimationFrame(step)
    else onComplete?.()
  }
  raf = requestAnimationFrame(step)
  return {
    kill() {
      killed = true
      cancelAnimationFrame(raf)
    },
  }
}

function clamp(v: number, mn: number, mx: number) {
  return Math.min(Math.max(v, mn), mx)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function subscribeMotion(notify: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  query.addEventListener("change", notify)
  return () => query.removeEventListener("change", notify)
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  )
}

function makeInProgressTexture() {
  const width = 1280
  const height = 720
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (ctx) {
    ctx.fillStyle = "#f1f1ee"
    ctx.fillRect(0, 0, width, height)
    ctx.strokeStyle = "rgba(17,17,16,0.06)"
    const step = 40
    for (let x = 0; x <= width; x += step) {
      ctx.beginPath()
      ctx.moveTo(x + 0.5, 0)
      ctx.lineTo(x + 0.5, height)
      ctx.stroke()
    }
    for (let y = 0; y <= height; y += step) {
      ctx.beginPath()
      ctx.moveTo(0, y + 0.5)
      ctx.lineTo(width, y + 0.5)
      ctx.stroke()
    }
    ctx.fillStyle = "rgba(17,17,16,0.38)"
    ctx.font = "italic 54px Fraunces, Georgia, serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("In progress", width / 2, height / 2 - 8)
    ctx.font = "500 18px Outfit, system-ui, sans-serif"
    ctx.fillStyle = "rgba(17,17,16,0.32)"
    ctx.fillText("FINAL-YEAR PROJECT", width / 2, height / 2 + 42)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.NoColorSpace
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.userData.iw = width
  tex.userData.ih = height
  return tex
}

export type HoverSliderItem = {
  id: string
  title: string
  year: string
  tag: string
  desc: string
  tech: string[]
  img: string
  href?: string
}

type SliderMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>

type HoverSliderProps = {
  items: HoverSliderItem[]
  onActiveChange?: (index: number) => void
}

export default function HoverSlider({ items, onActiveChange }: HoverSliderProps) {
  const reducedMotion = useReducedMotion()
  const mountRef = useRef<HTMLDivElement>(null)
  const glRef = useRef<{
    setActive: (i: number) => void
    show: (i: number) => void
    hide: () => void
    onRowChange: (i: number) => void
  } | null>(null)
  const stateRef = useRef({ activeIndex: 0, hovering: true })
  const onActiveRef = useRef(onActiveChange)
  onActiveRef.current = onActiveChange

  const [active, setActive] = useState(0)
  const activeItem = items[active]
  const sourcesKey = items.map((item) => item.img).join("|")

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || items.length === 0) return

    let disposed = false
    let W = Math.max(1, mount.clientWidth)
    let H = Math.max(1, mount.clientHeight)
    let raf = 0
    const curveTweens: TweenHandle[] = []
    const animTweens: TweenHandle[] = []
    const kill = (list: TweenHandle[]) => {
      list.forEach((tween) => tween.kill())
      list.length = 0
    }

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    } catch {
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    renderer.toneMapping = THREE.NoToneMapping
    Object.assign(renderer.domElement.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      zIndex: "15",
      pointerEvents: "none",
    })
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera()
    const updateCamera = () => {
      camera.left = -W / 2
      camera.right = W / 2
      camera.top = H / 2
      camera.bottom = -H / 2
      camera.near = -2000
      camera.far = 2000
      camera.updateProjectionMatrix()
    }
    camera.position.z = 1000
    updateCamera()
    renderer.setSize(W, H, false)

    const fitCard = () => {
      const maxH = Math.max(1, Math.round(H * 0.82))
      const maxW = Math.max(1, Math.round(W * 0.98))
      let ch = maxH
      let cw = Math.round(ch * CARD_ASPECT)
      if (cw > maxW) {
        cw = maxW
        ch = Math.round(cw / CARD_ASPECT)
      }
      return { cw, ch }
    }

    const loader = new THREE.TextureLoader()
    const texCache: Record<string, THREE.Texture> = {}
    let placeholder: THREE.Texture | null = null
    let repaint = () => {}

    const getTexture = (src: string) => {
      if (!src) {
        placeholder ??= makeInProgressTexture()
        return placeholder
      }
      if (texCache[src]) return texCache[src]
      const tex = loader.load(src, (loaded) => {
        if (disposed) {
          loaded.dispose()
          return
        }
        loaded.colorSpace = THREE.NoColorSpace
        loaded.minFilter = THREE.LinearFilter
        loaded.magFilter = THREE.LinearFilter
        loaded.userData.iw = loaded.image?.width || 1
        loaded.userData.ih = loaded.image?.height || 1
        repaint()
      })
      tex.colorSpace = THREE.NoColorSpace
      tex.userData.iw = 1
      tex.userData.ih = 1
      texCache[src] = tex
      return tex
    }

    items.forEach((item) => getTexture(item.img))

    const syncImageSize = (mesh: SliderMesh) => {
      const texture = mesh.material.uniforms.uTexture.value as THREE.Texture | null
      if (!texture) return
      mesh.material.uniforms.uImageSize.value.set(
        texture.image?.width || texture.userData.iw || 1,
        texture.image?.height || texture.userData.ih || 1,
      )
    }

    let { cw: CW, ch: CH } = fitCard()
    const geo = new THREE.PlaneGeometry(1, 1, 80, 80)
    const firstTex = getTexture(items[0].img)

    const makeMat = (tex: THREE.Texture) =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: tex },
          uPlaneSize: { value: new THREE.Vector2(CW, CH) },
          uImageSize: { value: new THREE.Vector2(tex.userData.iw, tex.userData.ih) },
          uVelocity: { value: new THREE.Vector2(0, 0) },
          uAlpha: { value: 0 },
          uZoom: { value: 1.06 },
          uViewport: { value: new THREE.Vector2(W / 2, H / 2) },
          uCurvature: { value: 0 },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        side: THREE.DoubleSide,
      })

    const meshes: SliderMesh[] = Array.from({ length: VISIBLE }, (_, i) => {
      const mesh = new THREE.Mesh(geo, makeMat(firstTex))
      mesh.renderOrder = i
      scene.add(mesh)
      return mesh
    })

    const curveAnim = { value: 0, zoom: 1.06 }
    const anim = { alpha: 0 }
    let floatIdx = 0
    let prevFloat = 0
    const vel = new THREE.Vector2(0, 0)

    const getCurveForTravel = (targetIdx: number) => {
      const travel = Math.abs(targetIdx - floatIdx)
      const p = clamp((travel - 0.35) / 3.5, 0, 1)
      const eased = p * p * (3 - 2 * p)
      return lerp(SOFT_CURVE, ACTIVE_CURVE, eased)
    }

    const releaseCurve = (targetIdx = stateRef.current.activeIndex) => {
      if (reducedMotion) {
        curveAnim.value = 0
        return
      }
      const peakCurve = getCurveForTravel(targetIdx)
      kill(curveTweens)
      curveAnim.zoom = 1.06
      curveTweens.push(
        tweenTo(curveAnim, {
          value: peakCurve,
          duration: 0.12,
          ease: power2Out,
          onComplete() {
            curveTweens.push(
              tweenTo(curveAnim, {
                value: 0,
                duration: 1.25,
                ease: power2InOut,
              }),
            )
          },
        }),
      )
    }

    const show = (targetIdx: number) => {
      if (reducedMotion) {
        anim.alpha = 1
        curveAnim.value = 0
        return
      }
      kill(animTweens)
      animTweens.push(tweenTo(anim, { alpha: 1, duration: 0.45, ease: power3Out }))
      releaseCurve(targetIdx)
    }

    const hide = () => {
      if (reducedMotion) {
        anim.alpha = 0
        curveAnim.value = 0
        return
      }
      kill(animTweens)
      kill(curveTweens)
      animTweens.push(tweenTo(anim, { alpha: 0, duration: 0.35, ease: power2Out }))
      curveTweens.push(tweenTo(curveAnim, { value: 0, zoom: 1.06, duration: 0.55, ease: power2InOut }))
    }

    const onResize = () => {
      W = Math.max(1, mount.clientWidth)
      H = Math.max(1, mount.clientHeight)
      renderer.setSize(W, H, false)
      updateCamera()
      ;({ cw: CW, ch: CH } = fitCard())
      meshes.forEach((mesh) => {
        mesh.material.uniforms.uPlaneSize.value.set(CW, CH)
        mesh.material.uniforms.uViewport.value.set(W / 2, H / 2)
      })
    }

    const observer = new ResizeObserver(() => {
      onResize()
      repaint()
    })
    observer.observe(mount)
    onResize()

    const tick = () => {
      if (!reducedMotion) raf = requestAnimationFrame(tick)
      const targetIdx = stateRef.current.activeIndex
      const diff = targetIdx - floatIdx
      const distCatch = Math.abs(diff)
      const t = clamp(0.18 - distCatch * 0.06, 0.05, 0.18)
      floatIdx = reducedMotion ? targetIdx : floatIdx + diff * t
      const delta = floatIdx - prevFloat
      vel.y = lerp(vel.y, delta * 60, 0.16)
      vel.x = lerp(vel.x, 0, 0.14)
      prevFloat = floatIdx

      const centreInt = Math.round(floatIdx)
      const drift = floatIdx - centreInt
      const stackX = 0

      for (let i = 0; i < VISIBLE; i++) {
        const offset = i - HALF
        const itemIdx = ((centreInt + offset) % items.length + items.length) % items.length
        const posY = (-offset + drift) * (CH + GAP)
        const dist = Math.abs(offset - drift)
        const scaleH = Math.max(0.76, 1.0 - dist * 0.06)
        const sw = CW
        const sh = CH * scaleH
        const opacity = Math.max(0, 1 - dist * 0.22) * anim.alpha
        const wantTex = getTexture(items[itemIdx].img)
        if (meshes[i].material.uniforms.uTexture.value !== wantTex) {
          meshes[i].material.uniforms.uTexture.value = wantTex
        }
        syncImageSize(meshes[i])
        meshes[i].position.set(stackX, posY, i)
        meshes[i].scale.set(sw, sh, 1)
        meshes[i].material.uniforms.uVelocity.value.set(vel.x, vel.y * 0.28)
        meshes[i].material.uniforms.uAlpha.value = opacity
        meshes[i].material.uniforms.uZoom.value = curveAnim.zoom - clamp(1.0 - dist, 0, 1) * 0.04
        meshes[i].material.uniforms.uPlaneSize.value.set(sw, sh)
        meshes[i].material.uniforms.uCurvature.value = curveAnim.value
        meshes[i].material.uniforms.uViewport.value.set(W / 2, H / 2)
      }

      renderer.render(scene, camera)
    }

    repaint = () => {
      if (reducedMotion && !disposed) tick()
    }
    show(0)
    tick()

    glRef.current = {
      setActive: (i) => {
        stateRef.current.activeIndex = i
        repaint()
      },
      show,
      hide,
      onRowChange: releaseCurve,
    }

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      kill(animTweens)
      kill(curveTweens)
      observer.disconnect()
      geo.dispose()
      meshes.forEach((mesh) => {
        mesh.material.dispose()
        scene.remove(mesh)
      })
      Object.values(texCache).forEach((texture) => texture.dispose())
      placeholder?.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      glRef.current = null
    }
  }, [sourcesKey, items, reducedMotion])

  const activate = useCallback(
    (index: number) => {
      const wasHovering = stateRef.current.hovering
      stateRef.current.hovering = true
      stateRef.current.activeIndex = index
      setActive(index)
      onActiveRef.current?.(index)
      glRef.current?.setActive(index)
      if (!wasHovering) glRef.current?.show(index)
      else glRef.current?.onRowChange(index)
    },
    [],
  )

  const open = (index: number) => {
    activate(index)
    const href = items[index]?.href
    if (href) window.open(href, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="project-hover-stage">
      <div className="project-hover-list">
        <div className="project-hover-cols" aria-hidden>
          <span>ID</span>
          <span>Title</span>
          <span>Year</span>
        </div>
        {items.map((item, index) => {
          const isActive = active === index
          return (
            <button
              key={item.id}
              type="button"
              className={`project-hover-row${isActive ? " is-active" : ""}`}
              aria-label={`${item.title}. ${item.desc}`}
              aria-pressed={isActive}
              onPointerEnter={() => activate(index)}
              onFocus={() => activate(index)}
              onClick={() => open(index)}
            >
              <span className="project-hover-id">{item.id}</span>
              <span className="project-hover-title">{item.title}</span>
              <span className="project-hover-year">{item.year}</span>
            </button>
          )
        })}
      </div>
      <div className="project-hover-detail">
        <div ref={mountRef} className="project-hover-preview" />
        {activeItem ? (
          <div className="project-hover-copy" key={activeItem.id}>
            <div className="project-folio-meta">
              <span className="project-folio-tag">{activeItem.tag}</span>
              <span className="project-folio-year">{activeItem.year}</span>
            </div>
            <h3 className="font-display project-folio-title">
              {activeItem.href ? (
                <a href={activeItem.href} target="_blank" rel="noopener noreferrer">
                  {activeItem.title}
                  <span className="project-folio-arrow" aria-hidden>
                    ↗
                  </span>
                </a>
              ) : (
                activeItem.title
              )}
            </h3>
            <p className="project-folio-desc">{activeItem.desc}</p>
            <div className="project-hover-copy-foot">
              <div className="project-folio-tech">
                {activeItem.tech.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              {activeItem.href ? (
                <a
                  className="project-hover-link"
                  href={activeItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View ↗
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
