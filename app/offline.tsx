"use client"

export default function Offline() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl mb-4">📡</div>
        <h1 className="text-2xl font-serif font-bold">You're Offline</h1>
        <p className="text-muted-foreground">
          Your changes are being saved locally. They'll sync when you're back online.
        </p>
        <button
          onClick={() => location.reload()}
          className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-opacity-90 transition"
        >
          Retry Connection
        </button>
      </div>
    </div>
  )
}
