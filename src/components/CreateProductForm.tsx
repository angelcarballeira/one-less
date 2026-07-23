import { useState } from 'react'
import { createProduct } from '../services/products'
import type { Product } from '../types/product'

type Props = {
  onProductCreated: (product: Product) => void
}

export default function CreateProductForm({
  onProductCreated,
}: Props) {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [expectedUses, setExpectedUses] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const parsedExpectedUses = Number(expectedUses)

    if (!name.trim()) {
      alert('Ingresá el nombre del producto')
      return
    }

    if (!category) {
      alert('Seleccioná una categoría')
      return
    }

    if (
      !Number.isInteger(parsedExpectedUses) ||
      parsedExpectedUses <= 0
    ) {
      alert('Los usos esperados deben ser un número mayor que cero')
      return
    }

    try {
      setIsSubmitting(true)

      const newProduct = await createProduct({
        name: name.trim(),
        brand: brand.trim() || null,
        category,
        expected_uses: parsedExpectedUses,
      })

      onProductCreated(newProduct)

      setName('')
      setBrand('')
      setCategory('')
      setExpectedUses('')
    } catch (error) {
      console.error('Error al crear el producto:', error)
      alert('No se pudo crear el producto')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Nuevo producto
        </h2>

        <p className="mt-1 text-slate-600">
          Agregá un producto para comenzar a controlar su duración.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2"
      >
        <div>
          <label
            htmlFor="product-name"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Nombre del producto
          </label>

          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Jabón líquido 3 L"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          />
        </div>

        <div>
          <label
            htmlFor="product-brand"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Marca
          </label>

          <input
            id="product-brand"
            type="text"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            placeholder="Ej. Ala"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          />
        </div>

        <div>
          <label
            htmlFor="product-category"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Categoría
          </label>

          <select
            id="product-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
          >
            <option value="">Seleccioná una categoría</option>
            <option value="Jabón para ropa">
              Jabón para ropa
            </option>
            <option value="Suavizante">Suavizante</option>
            <option value="Pasta dental">Pasta dental</option>
            <option value="Jabón de manos">
              Jabón de manos
            </option>
            <option value="Shampoo">Shampoo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="expected-uses"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Usos esperados
          </label>

          <input
            id="expected-uses"
            type="number"
            min="1"
            step="1"
            value={expectedUses}
            onChange={(event) => setExpectedUses(event.target.value)}
            placeholder="Ej. 22"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? 'Creando producto...'
              : 'Crear producto'}
          </button>
        </div>
      </form>
    </section>
  )
}