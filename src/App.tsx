/* function App() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-slate-900">One Less</h1>
        <p className="mt-4 text-slate-600">
          Controlar la cantidad de usos de mis productos.
        </p>
      </div>
    </main>
  )
}

export default App

 */

import { useEffect } from 'react'
import { supabase } from './lib/supabase'

function App() {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.auth.getSession()

      console.log('SESSION:', data)
      console.log('ERROR:', error)
    }

    testConnection()
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-slate-900">One Less</h1>
        <p className="mt-4 text-slate-600">
          Supabase connected successfully.
        </p>
      </div>
    </main>
  )
}

export default App