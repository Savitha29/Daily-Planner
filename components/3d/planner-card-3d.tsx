"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, OrbitControls } from "@react-three/drei"
import type { Mesh } from "three"
import { motion } from "framer-motion"

interface PlannerCard3DProps {
  onTaskComplete?: () => void
  isCompleting?: boolean
}

function PlannerCardMesh({ onTaskComplete, isCompleting }: PlannerCard3DProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const rotationX = useRef(0)
  const rotationY = useRef(0)

  useFrame(() => {
    if (meshRef.current) {
      // Smooth rotation based on hover state
      const targetX = hovered ? rotationX.current * 0.1 : 0
      const targetY = hovered ? rotationY.current * 0.1 : 0

      meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.1
      meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.1

      // Slight floating animation
      meshRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.2
    }
  })

  const handleMouseMove = (e: any) => {
    if (hovered) {
      const bounds = e.target.getBoundingClientRect()
      rotationX.current = ((e.clientY - bounds.top) / bounds.height - 0.5) * Math.PI
      rotationY.current = ((e.clientX - bounds.left) / bounds.width - 0.5) * Math.PI
    }
  }

  return (
    <mesh
      ref={meshRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={onTaskComplete}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[4, 5, 0.5]} />
      <meshStandardMaterial
        color="#a8937a"
        roughness={0.4}
        metalness={0.3}
        emissive="#d4a574"
        emissiveIntensity={hovered ? 0.5 : 0}
      />

      {/* Inner surface for notebook aesthetic */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[3.9, 4.9, 0.1]} />
        <meshStandardMaterial color="#f5f3f0" roughness={0.6} metalness={0} />
      </mesh>
    </mesh>
  )
}

export function PlannerCard3D({ onTaskComplete, isCompleting }: PlannerCard3DProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="w-full h-full relative">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 50 }} style={{ width: "100%", height: "100%" }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#d4a574" />

        <PlannerCardMesh onTaskComplete={onTaskComplete} isCompleting={isCompleting} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={2}
          maxPolarAngle={Math.PI / 2.5}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>

      {/* Overlay text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center text-white drop-shadow-lg">
          <p className="text-sm font-serif opacity-80">Interactive 3D Planner</p>
          <p className="text-xs opacity-60">Click to complete a task</p>
        </div>
      </motion.div>
    </div>
  )
}
