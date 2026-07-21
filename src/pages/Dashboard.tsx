import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import CreateProductForm from '../components/CreateProductForm'
import { getProducts } from '../services/products'
import type { Product } from '../types/product'

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              One Less
            </h1>
            <p className="text-slate-600">
              Controla cuánto duran realmente tus productos
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-100 transition"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Formulario para crear productos */}
        <CreateProductForm onCreated={loadProducts} />

        {/* Lista de productos */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Mis productos
            </h2>

            <span className="text-sm text-slate-500">
              {products.length} producto{products.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="py-10 text-center text-slate-500">
              Cargando productos...
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center text-slate-500">
              Todavía no tenés productos. Creá el primero arriba.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">
                        {product.name}
                      </h3>

                      {product.brand && (
                        <p className="text-slate-500">
                          {product.brand}
                        </p>
                      )}
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {product.category}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Usos esperados
                      </span>

                      <span className="font-medium text-slate-900">
                        {product.expected_uses}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Fecha de inicio
                      </span>

                      <span className="font-medium text-slate-900">
                        {new Date(product.start_date).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <button className="w-full py-2 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition">
                      Ver detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}