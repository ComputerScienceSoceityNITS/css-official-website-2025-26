import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, ContactShadows } from '@react-three/drei'

/**
 * ComputerModel — a flat-shaded workstation that turns toward the cursor.
 *
 * Built from primitives rather than a loaded GLTF: no asset to ship, no
 * network dependency, and the ARCH palette is applied directly to the
 * materials. Tracking is done on `window` (not the canvas) so the model
 * answers the pointer anywhere in the hero, and damped with a lerp so it
 * glides instead of snapping.
 */

// Framing note: R3F aims the default camera at the scene origin, but the
// workstation's geometry runs y -0.5 .. 2.05, so it needs dropping to sit in
// frame. The binding constraint at the bottom is the keyboard, which sits
// forward at z ~1.8 — being closer to the camera, it projects far lower than
// its y alone suggests. BASE_Y and the camera distance below are set so the
// monitor top and the keyboard front both clear the frustum by ~30%.
const BASE_Y = -0.55

const INK = '#1C1C1C'
const INK_SOFT = '#33312C'
const PAPER = '#F4F3EF'
const CARD = '#FFFFFF'
const LINE = '#D8D5CE'

function Workstation({ pointer, reduced }) {
  const group = useRef(null)
  const caret = useRef(null)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    const t = state.clock.elapsedTime
    const k = 1 - Math.pow(0.001, delta) // frame-rate independent damping

    if (reduced) {
      g.rotation.set(0, -0.18, 0)
      g.position.y = BASE_Y
    } else {
      const targetY = pointer.current.x * 0.5 - 0.05
      const targetX = -pointer.current.y * 0.26

      g.rotation.y += (targetY - g.rotation.y) * k
      g.rotation.x += (targetX - g.rotation.x) * k
      // gentle idle drift so it never sits perfectly still
      g.position.y = BASE_Y + Math.sin(t * 0.7) * 0.055
    }

    if (caret.current) {
      caret.current.visible = reduced ? true : Math.floor(t * 1.8) % 2 === 0
    }
  })

  return (
    <group ref={group} position={[0, BASE_Y, 0]}>
      {/* ---- monitor ---- */}
      <RoundedBox args={[3.3, 2.2, 0.18]} radius={0.05} smoothness={4} position={[0, 0.95, 0]}>
        <meshStandardMaterial color={INK} roughness={0.62} metalness={0} />
      </RoundedBox>

      {/* screen */}
      <mesh position={[0, 1.0, 0.1]}>
        <planeGeometry args={[3.0, 1.86]} />
        <meshBasicMaterial color={PAPER} />
      </mesh>

      {/* screen content */}
      <group position={[0, 1.0, 0.105]}>
        <mesh position={[-0.72, 0.6, 0]}>
          <planeGeometry args={[1.32, 0.075]} />
          <meshBasicMaterial color={INK} />
        </mesh>
        <mesh position={[-0.95, 0.4, 0]}>
          <planeGeometry args={[0.86, 0.06]} />
          <meshBasicMaterial color={LINE} />
        </mesh>
        <mesh position={[-0.62, 0.2, 0]}>
          <planeGeometry args={[1.52, 0.06]} />
          <meshBasicMaterial color={LINE} />
        </mesh>
        <mesh position={[-1.02, 0, 0]}>
          <planeGeometry args={[0.72, 0.06]} />
          <meshBasicMaterial color={LINE} />
        </mesh>
        <mesh position={[-0.8, -0.2, 0]}>
          <planeGeometry args={[1.16, 0.06]} />
          <meshBasicMaterial color={LINE} />
        </mesh>
        {/* caret */}
        <mesh ref={caret} position={[-1.24, -0.45, 0]}>
          <planeGeometry args={[0.1, 0.16]} />
          <meshBasicMaterial color={INK} />
        </mesh>
        {/* header hairline */}
        <mesh position={[0, 0.82, 0]}>
          <planeGeometry args={[3.0, 0.012]} />
          <meshBasicMaterial color={LINE} />
        </mesh>
      </group>

      {/* ---- stand ---- */}
      <mesh position={[0, 0.05, -0.02]}>
        <boxGeometry args={[0.36, 0.72, 0.2]} />
        <meshStandardMaterial color={INK_SOFT} roughness={0.7} metalness={0} />
      </mesh>
      <RoundedBox args={[1.5, 0.1, 0.72]} radius={0.03} smoothness={3} position={[0, -0.33, 0]}>
        <meshStandardMaterial color={INK_SOFT} roughness={0.7} metalness={0} />
      </RoundedBox>

      {/* ---- keyboard ---- */}
      <group position={[0, -0.44, 1.35]} rotation={[-0.06, 0, 0]}>
        <RoundedBox args={[2.5, 0.11, 0.88]} radius={0.03} smoothness={3}>
          <meshStandardMaterial color={CARD} roughness={0.8} metalness={0} />
        </RoundedBox>
        {[0.22, 0.02, -0.18].map((z, i) => (
          <mesh key={i} position={[0, 0.062, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.1, 0.1]} />
            <meshBasicMaterial color={LINE} />
          </mesh>
        ))}
      </group>

      {/* ---- mouse ---- */}
      <RoundedBox
        args={[0.32, 0.11, 0.48]}
        radius={0.05}
        smoothness={4}
        position={[1.68, -0.44, 1.32]}
      >
        <meshStandardMaterial color={CARD} roughness={0.8} metalness={0} />
      </RoundedBox>
    </group>
  )
}

const ComputerModel = ({ className = '' }) => {
  const wrapRef = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const [active, setActive] = useState(true)

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* Track the pointer across the whole window, normalised to -1..1. */
  useEffect(() => {
    if (reduced) return

    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced])

  /* Stop rendering once the hero has scrolled away. */
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className={`h-full w-full ${className}`}>
      <Canvas
        dpr={[1, 1.6]}
        frameloop={active ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.75, 7.8], fov: 32 }}
      >
        <ambientLight intensity={1.15} />
        <directionalLight position={[4, 6, 5]} intensity={1.5} />
        <directionalLight position={[-5, 2, -3]} intensity={0.5} />

        <Workstation pointer={pointer} reduced={reduced} />

        <ContactShadows
          position={[0, -0.95, 0.4]}
          opacity={0.3}
          scale={9}
          blur={2.6}
          far={3}
          resolution={256}
          color={INK}
        />
      </Canvas>
    </div>
  )
}

export default React.memo(ComputerModel)
