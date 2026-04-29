"use client"

import { motion } from "framer-motion"
import { JournalPanel } from "@/components/dashboard/journal-panel"
import { useState } from "react"

export default function JournalPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-serif font-bold mb-2">Journal</h1>
        <p className="text-muted-foreground">Reflect on your day with gratitude and mindfulness</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <JournalPanel date={selectedDate} onDateChange={setSelectedDate} />
      </motion.div>
    </motion.div>
  )
}
