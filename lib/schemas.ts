import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  name: string
  image?: string
  provider: "google" | "email"
  passwordHash?: string // Only for email auth
  createdAt: Date
  updatedAt: Date
}

export interface DailyPlanner {
  _id?: ObjectId
  userId: ObjectId
  date: Date
  notes: string
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  _id?: ObjectId
  userId: ObjectId
  plannerId: ObjectId
  date: Date
  title: string
  completed: boolean
  priority: "low" | "medium" | "high"
  timeOfDay: "morning" | "afternoon" | "evening"
  createdAt: Date
  updatedAt: Date
}

export interface JournalEntry {
  _id?: ObjectId
  userId: ObjectId
  date: Date
  affirmation: string
  gratitude: string[]
  highlights: string[]
  reflection: string
  mood: string // emoji representation
  createdAt: Date
  updatedAt: Date
}

export interface Habit {
  _id?: ObjectId
  userId: ObjectId
  name: string
  color: string
  completed: boolean[]
  currentStreak: number
  bestStreak: number
  createdAt: Date
  updatedAt: Date
}

export interface Habit {
  _id?: ObjectId
  userId: ObjectId
  name: string
  color: string
  completed: boolean[]
  currentStreak: number
  bestStreak: number
  createdAt: Date
  updatedAt: Date
}

export interface HabitLog {
  _id?: ObjectId
  userId: ObjectId
  habitId: ObjectId
  date: Date
  completed: boolean
}
