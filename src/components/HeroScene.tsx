import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { prefersReducedMotion } from '../lib/smooth'
import { createAiPortrait } from './aiPortrait'

type Body = {
  mesh: THREE.Object3D
  home: THREE.Vector3
  offset: THREE.Vector3
  spin: THREE.Vector3
  depth: number
  phase: number
}

/**
 * Abstract geometric field. Shapes drift, rotate toward the cursor, get pushed
 * away when the cursor passes near them, and the cursor itself is a light source.
 * `progress` (0..1) is the hero scroll progress, used for the scroll parallax.
 */
export function HeroScene({ progress, ready }: { progress: React.MutableRefObject<number>; ready: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  // the AI head starts assembling once the preloader has finished
  const readyRef = useRef(ready)
  readyRef.current = ready

  useEffect(() => {
    const el = host.current!
    const reduced = prefersReducedMotion()
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.55

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, 14)

    const world = new THREE.Group()
    scene.add(world)

    // lights: cool key, warm rim, and a cursor-driven ember light
    scene.add(new THREE.AmbientLight(0xffffff, 0.15))
    const key = new THREE.DirectionalLight(0xdfe6ff, 1.6)
    key.position.set(-6, 8, 6)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xff5a1f, 2.2)
    rim.position.set(8, -4, -6)
    scene.add(rim)
    const cursorLight = new THREE.PointLight(0xff6a2b, 40, 18, 1.6)
    cursorLight.position.set(0, 0, 4)
    scene.add(cursorLight)

    const chrome = new THREE.MeshPhysicalMaterial({ color: 0x1a1a1d, metalness: 0.9, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.15 })
    const bone = new THREE.MeshPhysicalMaterial({ color: 0xe9e6df, metalness: 0.05, roughness: 0.35, clearcoat: 0.6, sheen: 0.4 })
    const ember = new THREE.MeshPhysicalMaterial({ color: 0xff4f1a, metalness: 0.3, roughness: 0.28, clearcoat: 1, emissive: 0x3a0a00 })

    const bodies: Body[] = []
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number], scale: number, flat = false) => {
      const m = mat.clone() as THREE.MeshPhysicalMaterial
      if (flat && 'flatShading' in m) m.flatShading = true
      const mesh = new THREE.Mesh(geo, m)
      mesh.scale.setScalar(scale)
      mesh.position.set(...pos)
      mesh.rotation.set(Math.random() * 6, Math.random() * 6, 0)
      world.add(mesh)
      bodies.push({
        mesh,
        home: new THREE.Vector3(...pos),
        offset: new THREE.Vector3(),
        spin: new THREE.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.2),
        depth: (pos[2] + 6) / 10,
        phase: Math.random() * Math.PI * 2,
      })
      return mesh
    }

    // hero object: the android portrait. It has its own scene and a fixed camera so it stays perfectly
    // still while the shapes drift; only its eyes follow the cursor.
    const ai = createAiPortrait(renderer.getPixelRatio())
    const aiScene = new THREE.Scene()
    const aiCam = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    aiCam.position.set(0, 0, 14)
    const aiHome = new THREE.Vector3(3.6, 0.15, 0)
    ai.group.position.copy(aiHome)
    aiScene.add(ai.group)
    const eyeNdc = new THREE.Vector3()
    const lookTarget = new THREE.Vector2()
    let buildStart = -1

    add(new THREE.TorusKnotGeometry(0.6, 0.2, 160, 24), ember, [-4.6, 2.4, -2], 1)
    add(new THREE.OctahedronGeometry(1, 0), bone, [-2.2, -2.6, 1], 0.8, true)
    add(new THREE.TorusGeometry(0.9, 0.08, 24, 120), bone, [9.2, 3.4, -4], 1.1)
    add(new THREE.TetrahedronGeometry(1, 0), chrome, [1, 3.3, -3], 0.9, true)
    add(new THREE.BoxGeometry(1, 1, 1), chrome, [-6.4, -1.2, -4], 0.9)
    add(new THREE.SphereGeometry(1, 48, 48), ember, [6.8, 2.8, -4], 0.45)
    add(new THREE.ConeGeometry(0.7, 1.4, 4, 1), bone, [-0.6, -3.4, -3.5], 0.8, true)
    add(new THREE.DodecahedronGeometry(1, 0), chrome, [-3.8, 0.2, 2.2], 0.45, true)
    add(new THREE.CylinderGeometry(0.15, 0.15, 3, 24), bone, [2.2, -1.8, 2], 0.7)
    add(new THREE.OctahedronGeometry(1, 0), ember, [0.6, 1.6, 3], 0.22, true)
    const sparkBody = bodies[bodies.length - 1]
    add(new THREE.TorusGeometry(0.5, 0.18, 16, 60), chrome, [-1.4, 3.6, -1], 0.6)

    // dust field
    const n = 700
    const pts = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      pts[i * 3] = (Math.random() - 0.5) * 30
      pts[i * 3 + 1] = (Math.random() - 0.5) * 18
      pts[i * 3 + 2] = (Math.random() - 0.5) * 16 - 4
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xe9e6df, size: 0.025, transparent: true, opacity: 0.55, sizeAttenuation: true }))
    scene.add(dust)

    // input
    const mouse = new THREE.Vector2(0, 0)
    const smooth = new THREE.Vector2(0, 0)
    const ray = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const hit = new THREE.Vector3()
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    }
    window.addEventListener('pointermove', onMove)

    // On desktop the face sits just after the end of the name, whatever the screen width, so there is
    // never a gap between them; on wide screens the portrait also grows a little.
    const placeAi = () => {
      const w = el.clientWidth
      const h = el.clientHeight || 1
      if (w < 700) {
        aiHome.set(1.0, 2.6, 0)
        ai.group.scale.setScalar(1)
        return
      }
      const halfW = camera.position.z * Math.tan(THREE.MathUtils.degToRad(17.5)) * (w / h)
      const k = THREE.MathUtils.clamp(w / h / 1.55, 1, 1.3)
      ai.group.scale.setScalar(k)
      // layout position, ignoring the scroll parallax transforms on the name lines,
      // so the portrait never slides sideways while scrolling
      const left = (n: HTMLElement) => {
        let x = 0
        for (let p: HTMLElement | null = n; p; p = p.offsetParent as HTMLElement | null) x += p.offsetLeft
        return x
      }
      const elLeft = left(el)
      const rightOf = (sel: string) => {
        const n = document.querySelector<HTMLElement>(sel)
        return n ? left(n) + n.offsetWidth - elLeft : null
      }
      const nameEnd = rightOf('.hero-line-1 .word') ?? w * 0.57
      // face (between the eyes) just past the end of AMIRUL, like the 1360 px layout
      const faceX = ((nameEnd + w * 0.03) / w) * 2 - 1
      let x = faceX * halfW + ai.width * k * 0.175
      // wider than the desktop app: keep the nose (about 31% of the picture left of centre) clear of AMIRUL
      // and the chin (about 25%) clear of FAHMI
      if (w / h > 1.6) {
        const fahmiEnd = rightOf('.hero-line-2 .word') ?? nameEnd
        const toWorld = (px: number) => ((px + w * 0.015) / w * 2 - 1) * halfW
        x = Math.max(x, toWorld(nameEnd) + ai.width * k * 0.31, toWorld(fahmiEnd) + ai.width * k * 0.25)
      }
      aiHome.set(Math.min(x, halfW - ai.width * k * 0.42), 2.99 - 2.84 * k, 0)
    }
    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight || 1
      renderer.setSize(w, h)
      camera.aspect = w / h
      // pull back on narrow screens so the composition still fits
      camera.position.z = w < 700 ? 22 : 14
      // on phones the head sits above the name instead of beside it
      aiCam.aspect = w / h
      aiCam.position.z = camera.position.z
      aiCam.updateProjectionMatrix()
      placeAi()
      // keep the small ember spark off the face on phones
      sparkBody.home.set(w < 700 ? -2.2 : 0.6, w < 700 ? 3.6 : 1.6, 3)
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)

    let last = performance.now()
    let t = 0
    let raf = 0
    const tmp = new THREE.Vector3()
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      const now = performance.now()
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      t += dt
      const p = progress.current

      smooth.lerp(mouse, 0.06)
      camera.position.x = smooth.x * 0.9
      camera.position.y = smooth.y * 0.6 - p * 2
      camera.lookAt(0, -p * 2, 0)

      ray.setFromCamera(mouse, camera)
      ray.ray.intersectPlane(plane, hit)
      cursorLight.position.lerp(tmp.set(hit.x, hit.y, 3.5), 0.12)

      world.rotation.y = p * 0.9 + smooth.x * 0.08
      world.rotation.x = p * 0.4 - smooth.y * 0.05
      world.position.y = p * 3.5

      for (const b of bodies) {
        // repel from cursor (on the z=0 plane, weighted by depth)
        const dx = b.home.x + b.offset.x - hit.x
        const dy = b.home.y + b.offset.y - hit.y
        const d = Math.hypot(dx, dy)
        const R = 2.6
        if (d < R && !reduced) {
          const f = (1 - d / R) * 1.4
          b.offset.x += (dx / (d || 1)) * f * dt * 6
          b.offset.y += (dy / (d || 1)) * f * dt * 6
        }
        b.offset.multiplyScalar(0.94)
        const floatY = reduced ? 0 : Math.sin(t * 0.6 + b.phase) * 0.18
        // parallax layers: nearer objects travel further with scroll + mouse
        b.mesh.position.set(
          b.home.x + b.offset.x + smooth.x * b.depth * 0.6,
          b.home.y + b.offset.y + floatY + smooth.y * b.depth * 0.4 + p * b.depth * 4,
          b.home.z,
        )
        const s = reduced ? 0.2 : 1
        b.mesh.rotation.x += b.spin.x * dt * s + smooth.y * 0.002
        b.mesh.rotation.y += b.spin.y * dt * s + smooth.x * 0.002
        b.mesh.rotation.z += b.spin.z * dt * s
      }
      // the build runs on wall-clock time so a slow frame rate never stretches it
      if (buildStart < 0 && readyRef.current) buildStart = now
      if (Math.floor(t * 2) !== Math.floor((t - dt) * 2)) placeAi()
      ai.group.position.set(aiHome.x, aiHome.y + p * 3, aiHome.z)
      // eyes look toward the cursor (direction from the face to the pointer, on screen)
      eyeNdc.set(aiHome.x - ai.width * 0.17 * ai.group.scale.x, aiHome.y + ai.height * 0.127 * ai.group.scale.x + p * 3, 0).project(aiCam)
      lookTarget.set(mouse.x - eyeNdc.x, mouse.y - eyeNdc.y).multiplyScalar(1.6)
      if (lookTarget.length() > 1) lookTarget.normalize()
      if (reduced) lookTarget.set(0, 0)
      ai.update(buildStart < 0 ? -1 : reduced ? 99 : (now - buildStart) / 1000, t, lookTarget)
      dust.rotation.y = t * 0.01 + smooth.x * 0.05
      dust.position.y = p * 2

      renderer.render(scene, camera)
      renderer.autoClear = false
      renderer.render(aiScene, aiCam)
      renderer.autoClear = true
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      ro.disconnect()
      io.disconnect()
      for (const sc of [scene, aiScene]) sc.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Points || o instanceof THREE.Line || o instanceof THREE.Sprite) {
          o.geometry.dispose()
          ;(Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose())
        }
      })
      pmrem.dispose()
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [progress])

  return <div className="hero-canvas" ref={host} aria-hidden />
}
