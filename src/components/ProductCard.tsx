import type { Product } from '../types/product'

type Props = {
  product: Product
  currentUses: number
  isRegistering: boolean
  isDeleting: boolean
  onRegisterUse: (productId: string) => void
  onDelete: (product: Product) => void
}

export default function ProductCard({
  product,
  currentUses,
  isRegistering,
  isDeleting,
  onRegisterUse,
  onDelete,
}: Props) {
  const expectedUses = product.expected_uses

  const remainingUses = Math.max(
    expectedUses - currentUses,
    0,
  )

  const progress =
    expectedUses > 0
      ? Math.min((currentUses / expectedUses) * 100, 100)
      : 0

  const reachedExpectedUses =
    expectedUses > 0 && currentUses >= expectedUses

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="font-medium text-slate-700">
            {currentUses} de {expectedUses} usos
          </span>

          <span className="text-sm text-slate-500">
            {remainingUses > 0
              ? `${remainingUses} restantes`
              : 'Objetivo alcanzado'}
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-slate-900 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-right text-sm text-slate-500">
          {Math.round(progress)}%
        </p>

        {reachedExpectedUses && (
          <p className="mt-2 text-sm font-medium text-emerald-700">
            El producto alcanzó los usos esperados.
          </p>
        )}
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onRegisterUse(product.id)}
          disabled={isRegistering || isDeleting}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRegistering
            ? 'Registrando...'
            : '+ Registrar uso'}
        </button>

        <button
          type="button"
          onClick={() => onDelete(product)}
          disabled={isDeleting || isRegistering}
          className="w-full rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting
            ? 'Eliminando...'
            : 'Eliminar producto'}
        </button>
      </div>
    </article>
  )
}