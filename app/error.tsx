"use client"

import { useEffect } from "react"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-serif font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message || "An unexpected error occurred"}</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-opacity-90 transition"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
