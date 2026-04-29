"use client"

import { motion } from "framer-motion"

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <motion.div className="glass-card h-24 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="glass-card h-96 rounded-lg animate-pulse" />
        <motion.div className="glass-card h-96 rounded-lg animate-pulse" />
      </div>
    </div>
  )
}
