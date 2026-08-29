import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// The interactive WebGL Emblem Scene
const EmblemScene = ({ mouse, lightRef }) => {
  // Load local texture of the official app icon
  const texture = useTexture('/icons/icon-512.png')

  // Set up texture filtering for sharp details
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
    }
  }, [texture])

  const emblemRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // 1. Slow idle floating/oscillation rotation
    const idleOscillationX = Math.sin(time * 0.6) * 0.02
    const idleOscillationY = Math.cos(time * 0.5) * 0.02

    if (emblemRef.current) {
      emblemRef.current.rotation.x = idleOscillationX
      emblemRef.current.rotation.y = idleOscillationY
    }

    // 2. Move point light to track mouse cursor for interactive metallic highlights
    if (lightRef.current) {
      const targetX = mouse.current[0] * 4
      const targetY = mouse.current[1] * 4
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, 0.1)
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, targetY, 0.1)
    }
  })

  return (
    <group ref={emblemRef}>
      {/* 3D Backing Disc (Cylinder) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.15, 64]} />
        <meshStandardMaterial
          color="#020617"
          roughness={0.5}
          metalness={0.8}
        />
      </mesh>

      {/* Front Face Plate (Textured Circle slightly in front of cylinder cap) */}
      <mesh position={[0, 0, 0.076]}>
        <circleGeometry args={[2.48, 64]} />
        <meshStandardMaterial
          map={texture}
          bumpMap={texture}
          bumpScale={0.065} // physically raises the logo lines
          roughness={0.25}
          metalness={0.4}
          transparent={true} // supports transparency if the icon file has an alpha channel
          color="#ffffff"
        />
      </mesh>
    </group>
  )
}

// Main container component
export default function CssLogo3D({ onLoad }) {
  const containerRef = useRef()
  const lightRef = useRef()
  const mouse = useRef([0, 0])
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (onLoad) {
      onLoad()
    }
  }, [onLoad])

  const handlePointerMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    // Map mouse coordinates to [-1, 1] range
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    
    mouse.current = [x * 2.5, -y * 2.5] // track position for the point light

    setTilt({
      x: -y * 18, // Pitch tilt
      y: x * 18   // Yaw tilt
    })
  }

  const handlePointerLeave = () => {
    mouse.current = [0, 0]
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="w-full h-[320px] md:h-[450px] relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Background glow shadow effect */}
      <div className="absolute inset-0 bg-arch-ink rounded-full scale-75 pointer-events-none" />

      {/* Tiltable Container */}
      <div
        className="w-full h-full relative flex items-center justify-center"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.6s ease-out' : 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 7.8], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.5} />
          {/* Static Directional Light (Key Light) */}
          <directionalLight position={[3, 3, 5]} intensity={1.5} color="#ffffff" />
          {/* Static Directional Light (Fill Light) */}
          <directionalLight position={[-3, -2, 3]} intensity={0.5} color="#cbd5e1" />
          
          {/* Interactive Highlight Point Light (Cyan/Blue reflection) */}
          <pointLight ref={lightRef} position={[0, 0, 3]} intensity={1.8} color="#00f0ff" distance={8} decay={1.5} />
          
          <EmblemScene mouse={mouse} lightRef={lightRef} />
        </Canvas>
      </div>
    </div>
  )
}
