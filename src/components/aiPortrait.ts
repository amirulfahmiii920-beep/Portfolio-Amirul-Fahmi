import * as THREE from 'three'
import portraitUrl from '../assets/hero/ai-portrait.webp'

/*
 * The hero android: Fahmi's generated portrait (pure black background, keyed out in the shader).
 * After the page loads it assembles: coloured particles fly in and settle on the picture, a scan
 * line reveals the image from the bottom up, then the eyes flicker on. Afterwards only the eyes
 * move, following the cursor.
 */

const IMG_W = 1098
const IMG_H = 1433
const H = 6.6
const W = (H * IMG_W) / IMG_H
// eye openings in image pixels: centre and half size
const EYES = [
  { x: 452, y: 522, rx: 50, ry: 27 },
  { x: 263, y: 549, rx: 34, ry: 21 },
]
const uv = (x: number, y: number) => new THREE.Vector2(x / IMG_W, 1 - y / IMG_H)

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  r.addColorStop(0, 'rgba(255,255,255,1)')
  r.addColorStop(0.2, 'rgba(170,205,255,0.7)')
  r.addColorStop(0.5, 'rgba(80,120,255,0.15)')
  r.addColorStop(1, 'rgba(80,120,255,0)')
  g.fillStyle = r
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

export function createAiPortrait(pixelRatio: number) {
  const group = new THREE.Group()
  const look = new THREE.Vector2()

  const tex = new THREE.TextureLoader().load(portraitUrl)
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.anisotropy = 4

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: tex },
      uReveal: { value: 0 },
      uEyes: { value: 0 },
      uLook: { value: look },
      uTime: { value: 0 },
      uE1: { value: uv(EYES[0].x, EYES[0].y) },
      uR1: { value: new THREE.Vector2(EYES[0].rx / IMG_W, EYES[0].ry / IMG_H) },
      uE2: { value: uv(EYES[1].x, EYES[1].y) },
      uR2: { value: new THREE.Vector2(EYES[1].rx / IMG_W, EYES[1].ry / IMG_H) },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
uniform sampler2D uMap; uniform float uReveal; uniform float uEyes; uniform vec2 uLook; uniform float uTime;
uniform vec2 uE1; uniform vec2 uR1; uniform vec2 uE2; uniform vec2 uR2;
varying vec2 vUv;
float eye(vec2 p, vec2 c, vec2 r) { vec2 d = (p - c) / r; return 1.0 - smoothstep(0.55, 1.0, length(d)); }
void main(){
  vec2 p = vUv;
  float m1 = eye(p, uE1, uR1);
  float m2 = eye(p, uE2, uR2);
  // irises slide toward the cursor inside their sockets
  vec2 s = p - uLook * vec2(0.011, 0.006) * m1 - uLook * vec2(0.007, 0.004) * m2;
  float edge = uReveal - p.y;
  // a little horizontal glitch right at the scan edge
  float glitch = (1.0 - smoothstep(0.0, 0.05, abs(edge))) * (sin(p.y * 900.0 + uTime * 40.0) * 0.004);
  vec3 c = texture2D(uMap, s + vec2(glitch, 0.0)).rgb;
  float em = max(m1, m2);
  float pulse = 0.92 + 0.08 * sin(uTime * 2.2);
  c *= mix(1.0, mix(0.06, pulse, uEyes), em);
  float lum = max(c.r, max(c.g, c.b));
  float a = smoothstep(0.012, 0.085, lum);
  // fade the shoulders and the sides into the page
  a *= smoothstep(0.0, 0.22, p.y) * smoothstep(0.0, 0.05, p.x) * (1.0 - smoothstep(0.93, 1.0, p.x)) * (1.0 - smoothstep(0.97, 1.0, p.y));
  a *= step(0.0, edge);
  vec3 band = vec3(0.45, 0.7, 1.0) * (1.0 - smoothstep(0.0, 0.035, edge)) * step(0.0, edge) * step(uReveal, 0.999);
  gl_FragColor = vec4(c + band * 1.4, max(a, length(band) * 0.6 * a));
}`,
  })
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(W, H), mat)
  group.add(plane)

  // eye glow that moves with the irises
  const glowTex = glowTexture()
  const glows = EYES.map((e, i) => {
    const m = new THREE.SpriteMaterial({ map: glowTex, color: 0x9cc4ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false })
    const sp = new THREE.Sprite(m)
    const base = uv(e.x, e.y)
    const size = i === 0 ? 0.8 : 0.55
    sp.scale.set(size, size * 0.55, 1)
    sp.position.set((base.x - 0.5) * W, (base.y - 0.5) * H, 0.02)
    sp.userData.base = sp.position.clone()
    group.add(sp)
    return sp
  })

  // particles: sampled from the picture once it has loaded
  const ptsMat = new THREE.ShaderMaterial({
    uniforms: { uBuild: { value: 0 }, uOpacity: { value: 0 }, uPix: { value: pixelRatio }, uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `attribute vec3 aStart; attribute float aDelay; attribute vec3 aColor;
uniform float uBuild; uniform float uPix; uniform float uTime; varying vec3 vColor; varying float vK;
void main(){
  float k = clamp((uBuild * 1.4 - aDelay) / 0.5, 0.0, 1.0);
  k = 1.0 - pow(1.0 - k, 3.0);
  vec3 p = mix(aStart, position, k);
  p.xy += (1.0 - k) * vec2(sin(uTime * 1.3 + aDelay * 30.0), cos(uTime + aDelay * 17.0)) * 0.2;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uPix * (40.0 / -mv.z);
  vColor = aColor; vK = k;
}`,
    fragmentShader: `uniform float uOpacity; varying vec3 vColor; varying float vK;
void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
gl_FragColor = vec4(vColor * 1.6 + vec3(0.05, 0.1, 0.25), (1.0 - smoothstep(0.0, 0.5, d)) * uOpacity * (0.3 + 0.7 * vK)); }`,
  })
  const points = new THREE.Points(new THREE.BufferGeometry(), ptsMat)
  points.frustumCulled = false
  group.add(points)

  const img = new Image()
  img.onload = () => {
    const step = 6
    const cw = Math.floor(IMG_W / step)
    const ch = Math.floor(IMG_H / step)
    const cv = document.createElement('canvas')
    cv.width = cw
    cv.height = ch
    const g = cv.getContext('2d')!
    g.drawImage(img, 0, 0, cw, ch)
    const data = g.getImageData(0, 0, cw, ch).data
    const pos: number[] = []
    const start: number[] = []
    const col: number[] = []
    const delay: number[] = []
    for (let y = 0; y < ch; y++) {
      for (let x = 0; x < cw; x++) {
        const i = (y * cw + x) * 4
        const r = data[i] / 255, gg = data[i + 1] / 255, b = data[i + 2] / 255
        const lum = Math.max(r, gg, b)
        const v = 1 - y / ch
        if (lum < 0.14 || v < 0.16 || Math.random() > 0.75) continue
        const px = (x / cw - 0.5) * W
        const py = (v - 0.5) * H
        pos.push(px, py, (lum - 0.4) * 0.5)
        const a = Math.random() * Math.PI * 2
        const rr = 4 + Math.random() * 5
        start.push(px + Math.cos(a) * rr + 2, py + Math.sin(a) * rr * 0.7, (Math.random() - 0.5) * 6)
        col.push(r, gg, b)
        delay.push(v * 0.7 + Math.random() * 0.3)
      }
    }
    const geo = points.geometry
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('aStart', new THREE.Float32BufferAttribute(start, 3))
    geo.setAttribute('aColor', new THREE.Float32BufferAttribute(col, 3))
    geo.setAttribute('aDelay', new THREE.Float32BufferAttribute(delay, 1))
  }
  img.src = portraitUrl

  const span = (a: number, b: number, x: number) => Math.min(Math.max((x - a) / (b - a), 0), 1)
  const ease = (x: number) => 1 - Math.pow(1 - x, 3)

  /** `s` = seconds since the build started (negative = waiting), `t` = clock, `target` = where the cursor is, -1..1. */
  function update(s: number, t: number, target: THREE.Vector2) {
    mat.uniforms.uTime.value = t
    ptsMat.uniforms.uTime.value = t
    // particles converge, then hand over to the picture
    ptsMat.uniforms.uBuild.value = ease(span(0, 2.0, s))
    ptsMat.uniforms.uOpacity.value = s < 0 ? 0 : 0.85 * (1 - span(2.2, 3.4, s))
    // scan reveal from the bottom up
    mat.uniforms.uReveal.value = s < 0 ? 0 : ease(span(1.2, 3.0, s)) * 1.05
    // eyes flicker on, then breathe
    const on = span(3.0, 3.1, s)
    const flick = s > 3.0 && s < 3.6 ? (Math.sin(s * 85) > 0.25 ? 1 : 0.1) : 1
    mat.uniforms.uEyes.value = on * flick
    // a zero-height first layout gives a NaN direction once; never let it stick
    if (Number.isFinite(target.x) && Number.isFinite(target.y)) look.lerp(target, 0.08)
    if (!Number.isFinite(look.x) || !Number.isFinite(look.y)) look.set(0, 0)
    glows.forEach((g, i) => {
      const k = i === 0 ? 0.011 : 0.007
      g.position.x = g.userData.base.x + look.x * k * W
      g.position.y = g.userData.base.y + look.y * k * 0.55 * H
      ;(g.material as THREE.SpriteMaterial).opacity = on * flick * (0.32 + 0.08 * Math.sin(t * 2.2))
    })
  }

  return { group, update, width: W, height: H }
}
