import { Navigation } from '@/components/navigation'

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Leaderboard</h1>
          <p className="text-lg text-gray-600 mb-8">
            Top palindrome collectors and their amazing finds
          </p>
          <div className="bg-white rounded-lg p-8 shadow">
            <p className="text-gray-500">Leaderboard coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}
