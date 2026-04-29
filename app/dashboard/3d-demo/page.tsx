"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"

const PlannerCard3D = dynamic(
  () => import("@/components/3d/planner-card-3d").then((m) => ({ default: m.PlannerCard3D })),
  {
    ssr: false,
    loading: () => <div className="w-full h-96 bg-muted rounded-lg animate-pulse" />,
  },
)

export default function ThreeDemoPage() {
  const [completedTasks, setCompletedTasks] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)

  const handleTaskComplete = () => {
    setIsFlipping(true)
    setCompletedTasks((prev) => prev + 1)
    setTimeout(() => setIsFlipping(false), 600)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-serif font-bold mb-2">Interactive 3D Experience</h1>
        <p className="text-muted-foreground">Engage with your planner in a unique, immersive way</p>
      </motion.div>

      {/* 3D Canvas */}
      <motion.div
        className="glass-card h-96 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <PlannerCard3D onTaskComplete={handleTaskComplete} isCompleting={isFlipping} />
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="glass-card text-center">
          <p className="text-sm text-muted-foreground mb-2">Tasks Completed Today</p>
          <motion.p
            key={completedTasks}
            className="text-4xl font-bold text-secondary"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
          >
            {completedTasks}
          </motion.p>
        </div>

        <div className="glass-card text-center">
          <p className="text-sm text-muted-foreground mb-2">Week Streak</p>
          <p className="text-4xl font-bold text-secondary">7</p>
        </div>

        <div className="glass-card text-center">
          <p className="text-sm text-muted-foreground mb-2">Consistency</p>
          <p className="text-4xl font-bold text-secondary">95%</p>
        </div>
      </motion.div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-3 text-secondary">3D Features</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-secondary">→</span>
              <span>Tilt-responsive 3D planner card</span>
            </li>
            <li className="flex gap-2">
              <span className="text-secondary">→</span>
              <span>Smooth rotating animation</span>
            </li>
            <li className="flex gap-2">
              <span className="text-secondary">→</span>
              <span>Interactive click-to-complete</span>
            </li>
            <li className="flex gap-2">
              <span className="text-secondary">→</span>
              <span>Premium lighting effects</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="glass-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-3 text-secondary">Performance</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-secondary">✓</span>
              <span>Optimized for mobile devices</span>
            </li>
            <li className="flex gap-2">
              <span className="text-secondary">✓</span>
              <span>Smooth 60fps animations</span>
            </li>
            <li className="flex gap-2">
              <span className="text-secondary">✓</span>
              <span>Lazy loading with fallback</span>
            </li>
            <li className="flex gap-2">
              <span className="text-secondary">✓</span>
              <span>Touch-friendly interactions</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
