"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const mockData = [
  { date: "Mon", completed: 8, total: 10 },
  { date: "Tue", completed: 9, total: 10 },
  { date: "Wed", completed: 7, total: 10 },
  { date: "Thu", completed: 10, total: 10 },
  { date: "Fri", completed: 8, total: 10 },
  { date: "Sat", completed: 6, total: 10 },
  { date: "Sun", completed: 9, total: 10 },
]

const moodData = [
  { date: "Mon", mood: 7 },
  { date: "Tue", mood: 8 },
  { date: "Wed", mood: 6 },
  { date: "Thu", mood: 9 },
  { date: "Fri", mood: 7 },
  { date: "Sat", mood: 5 },
  { date: "Sun", mood: 8 },
]

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="space-y-6">
      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-serif font-bold mb-2">Your Analytics</h1>
        <p className="text-muted-foreground">Track your productivity and wellness trends</p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { label: "Total Tasks", value: "247", color: "bg-blue-500" },
          { label: "Completion Rate", value: "82%", color: "bg-green-500" },
          { label: "Current Streak", value: "12 days", color: "bg-orange-500" },
          { label: "Avg. Mood", value: "7.4/10", color: "bg-purple-500" },
        ].map((stat, i) => (
          <div key={i} className="glass-card">
            <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-secondary">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4">Weekly Task Completion</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis dataKey="date" stroke="currentColor" opacity={0.7} />
            <YAxis stroke="currentColor" opacity={0.7} />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" stackId="a" fill="#d4a574" />
            <Bar dataKey="total" stackId="a" fill="#e0e0e0" opacity={0.3} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4">Weekly Mood Tracking</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis dataKey="date" stroke="currentColor" opacity={0.7} />
            <YAxis stroke="currentColor" opacity={0.7} domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="mood" stroke="#d4a574" strokeWidth={3} dot={{ fill: "#d4a574", r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
