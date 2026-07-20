import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">One Less</h1>
            <p className="text-slate-600">
              Your product tracking dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-100 transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
          <p className="text-slate-600">
            Authentication is working correctly. Next we will create products and usage tracking.
          </p>
        </div>
      </div>
    </div>
  )
}