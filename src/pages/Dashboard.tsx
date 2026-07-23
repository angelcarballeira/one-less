import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import CreateProductForm from '../components/CreateProductForm'
import ProductCard from '../components/ProductCard'
import {
  deleteProduct,
  getProducts,
} from '../services/products'
import {
  getProductUses,
  registerProductUse,
} from '../services/productUses'
import type { Product } from '../types/product'

type ProductUseCounts = Record<string, number>

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [useCounts, setUseCounts] = useState<ProductUseCounts>({})
  const [loading, setLoading] = useState(true)

  const [registeringProductId, setRegisteringProductId] =
    useState<string | null>(null)

  const [deletingProductId, setDeletingProductId] =
    useState<string | null>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          throw userError
        }

        setUser(user)

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
        console.error(
          'Error al cargar el dashboard:',
          error,
        )

        alert('No se pudo cargar la información')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const handleProductCreated = (product: Product) => {
    setProducts((currentProducts) => [
      product,
      ...currentProducts,
    ])

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
        [productId]:
          (currentCounts[productId] ?? 0) + 1,
      }))
    } catch (error) {
      console.error(
        'Error al registrar el uso:',
        error,
      )

      alert('No se pudo registrar el uso')
    } finally {
      setRegisteringProductId(null)
    }
  }

  const handleDeleteProduct = async (
    product: Product,
  ) => {
    const confirmed = window.confirm(
      `¿Querés eliminar "${product.name}"?\n\nTambién se eliminarán todos sus usos registrados.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingProductId(product.id)

      await deleteProduct(product.id)

      setProducts((currentProducts) =>
        currentProducts.filter(
          (currentProduct) =>
            currentProduct.id !== product.id,
        ),
      )

      setUseCounts((currentCounts) => {
        const updatedCounts = { ...currentCounts }

        delete updatedCounts[product.id]

        return updatedCounts
      })
    } catch (error) {
      console.error(
        'Error al eliminar el producto:',
        error,
      )

      alert('No se pudo eliminar el producto')
    } finally {
      setDeletingProductId(null)
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error(
        'Error al cerrar sesión:',
        error,
      )

      alert('No se pudo cerrar la sesión')
    }
  }

  const userDisplayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    'Usuario'

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              One Less
            </h1>

            <p className="mt-1 text-slate-600">
              Hola, {userDisplayName}
            </p>

            <p className="text-slate-500">
              Controlá cuánto duran tus productos.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="self-start rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 sm:self-auto"
          >
            Cerrar sesión
          </button>
        </header>

        <CreateProductForm
          onProductCreated={handleProductCreated}
        />

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
              <p className="text-slate-600">
                Cargando productos...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="font-medium text-slate-900">
                Todavía no tenés productos
              </p>

              <p className="mt-1 text-slate-600">
                Creá tu primer producto para comenzar a
                registrar sus usos.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currentUses={
                    useCounts[product.id] ?? 0
                  }
                  isRegistering={
                    registeringProductId === product.id
                  }
                  isDeleting={
                    deletingProductId === product.id
                  }
                  onRegisterUse={handleRegisterUse}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}