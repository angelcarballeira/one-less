import { useState } from 'react'
import { createProduct } from '../services/products'

interface Props {
  onCreated: () => void
}

export default function CreateProductForm({ onCreated }: Props) {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('Laundry Detergent')
  const [expectedUses, setExpectedUses] = useState(22)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setLoading(true)

      await createProduct({
        name,
        brand,
        category,
        expected_uses: expectedUses,
      })

      setName('')
      setBrand('')
      setExpectedUses(22)

      onCreated()
    } catch (error) {
      console.error(error)
      alert('Error al crear el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-slate-900">
        Nuevo producto
      </h2>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Nombre del producto
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ala Matic 3L"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Marca
        </label>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Ala"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Categoría
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
        >
          <option>Jabón para ropa</option>
          <option>Suavizante</option>
          <option>Pasta dental</option>
          <option>Shampoo</option>
          <option>Jabón corporal</option>
          <option>Otro</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Usos esperados
        </label>
        <input
          type="number"
          min={1}
          value={expectedUses}
          onChange={(e) => setExpectedUses(Number(e.target.value))}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Crear producto'}
      </button>
    </form>
  )
}