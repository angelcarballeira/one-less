import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import CreateProductForm from '../components/CreateProductForm'
import {
  getProducts,
  deleteProduct,
} from '../services/products'
import { getProductUses, registerProductUse } from '../services/productUses'
import type { Product } from '../types/product'
import type { User } from '@supabase/supabase-js'

type ProductUseCounts = Record<string, number>

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [useCounts, setUseCounts] = useState<ProductUseCounts>({})
  const [loading, setLoading] = useState(true)
  const [registeringProductId, setRegisteringProductId] = useState<
    string | null
  >(null)
  const [deletingProductId, setDeletingProductId] =
    useState<string | null>(null)

  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    setUser(user)
  }

  useEffect(() => {
    loadProducts()
    loadUser()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)

      const productsData = await getProducts()
      setProducts(productsData)

      const countsEntries = await Promise.all(
        productsData.map(async (product) => {
          const uses = await getProductUses(product.id)
          return [product.id, uses.length] as const
        }),
      )

      setUseCounts(Object.fromEntries(countsEntries))
    } catch (error) {
      console.error('Error al cargar los productos:', error)
      alert('No se pudieron cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  const handleProductCreated = (product: Product) => {
    setProducts((currentProducts) => [product, ...currentProducts])

    setUseCounts((currentCounts) => ({
      ...currentCounts,
      [product.id]: 0,
    }))
  }

  const handleRegisterUse = async (productId: string) => {
    try {
      setRegisteringProductId(productId)

      await registerProductUse(productId)

      setUseCounts((currentCounts) => ({
        ...currentCounts,
        [productId]: (currentCounts[productId] ?? 0) + 1,
      }))
    } catch (error) {
      console.error('Error al registrar el uso:', error)
      alert('No se pudo registrar el uso')
    } finally {
      setRegisteringProductId(null)
    }
  }

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `¿Eliminar "${product.name}"?\n\nTambién se eliminarán todos los usos registrados.`,
    )

    if (!confirmed) return

    try {
      setDeletingProductId(product.id)

      await deleteProduct(product.id)

      setProducts((currentProducts) =>
        currentProducts.filter(
          (currentProduct) => currentProduct.id !== product.id,
        ),
      )

      setUseCounts((currentCounts) => {
        const updated = { ...currentCounts }
        delete updated[product.id]
        return updated
      })
    } catch (error) {
      console.error(error)
      alert('No se pudo eliminar el producto')
    } finally {
      setDeletingProductId(null)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              One Less
            </h1>

            <p className="text-slate-600 mt-1">
              Hola, {user?.email}
            </p>

            <p className="text-slate-500">
              Controla cuánto duran tus productos.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-300 px-4 py-2 transition hover:bg-slate-100"
          >
            Cerrar sesión
          </button>
        </header>

        <CreateProductForm onProductCreated={handleProductCreated} />

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Mis productos
            </h2>
            <p className="text-slate-600">
              Registrá cada uso para medir su rendimiento real.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-slate-600">Cargando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <p className="font-medium text-slate-900">
                Todavía no tenés productos
              </p>
              <p className="mt-1 text-slate-600">
                Creá tu primer producto para comenzar a registrar sus usos.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {products.map((product) => {
                const currentUses = useCounts[product.id] ?? 0
                const expectedUses = product.expected_uses
                const remainingUses = Math.max(
                  expectedUses - currentUses,
                  0,
                )
                const progress =
                  expectedUses > 0
                    ? Math.min((currentUses / expectedUses) * 100, 100)
                    : 0

                const isRegistering =
                  registeringProductId === product.id

                return (
                  <article
                    key={product.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-4">
                      <p className="text-sm font-medium text-slate-500">
                        {product.category}
                      </p>

                      <h3 className="text-xl font-bold text-slate-900">
                        {product.name}
                      </h3>

                      {product.brand && (
                        <p className="text-slate-600">
                          Marca: {product.brand}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-slate-700">
                          {currentUses} de {expectedUses} usos
                        </span>

                        <span className="text-sm text-slate-500">
                          {remainingUses} restantes
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-slate-900 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => handleRegisterUse(product.id)}
                        disabled={
                          isRegistering ||
                          deletingProductId === product.id
                        }
                        className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isRegistering
                          ? 'Registrando...'
                          : '+ Registrar uso'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product)}
                        disabled={
                          deletingProductId === product.id
                        }
                        className="w-full rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                      >
                        {deletingProductId === product.id
                          ? 'Eliminando...'
                          : 'Eliminar producto'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}