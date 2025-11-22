import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const navigate = useNavigate()

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('http://localhost:4000/products')
      const data = await response.json()
      const items = Array.isArray(data?.products) ? data.products : []
      setAllProducts(items)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Fetch products error', err)
      setError('Unable to load products right now')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const deleteProduct = async id => {
    try {
      await fetch('http://localhost:4000/delete-product', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      await fetchProducts()
    } catch (err) {
      console.error('Delete product error', err)
      setError('Unable to delete product. Please try again.')
    }
  }

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      const term = searchTerm.trim().toLowerCase()
      const matchesSearch = term
        ? product.name?.toLowerCase().includes(term) || product.category?.toLowerCase().includes(term)
        : true
      return matchesCategory && matchesSearch
    })
  }, [allProducts, categoryFilter, searchTerm])

  const skeletonRows = Array.from({ length: 4 })

  const openProductModal = product => {
    setSelectedProduct(product)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
  }

  const handleEditNavigation = product => {
    if (!product) return
    const targetId = product.id || product._id
    if (!targetId) return
    closeProductModal()
    navigate(`/edit-product/${targetId}`)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Inventory</p>
          <h1 className="text-2xl font-semibold text-slate-900">Product catalog</h1>
          {lastUpdated && (
            <p className="text-sm text-slate-500">Updated {lastUpdated.toLocaleString()}</p>
          )}
        </div>
        <button
          type="button"
          onClick={fetchProducts}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {error}
        </div>
      )}

      <div className="space-y-4 rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-inner">
        <div className="flex flex-wrap gap-4">
          <input
            type="search"
            placeholder="Search by name or category"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            className="flex-1 min-w-[220px] rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <select
            value={categoryFilter}
            onChange={event => setCategoryFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            <option value="all">All categories</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kids">Kids</option>
          </select>
        </div>

        <div className="w-full overflow-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3">Product</th>
                <th className="py-3">Title</th>
                <th className="py-3">Old price</th>
                <th className="py-3">New price</th>
                <th className="py-3">Category</th>
                <th className="py-3 text-center">Availability</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading
                ? skeletonRows.map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4">
                      <div className="h-14 w-14 rounded-xl bg-slate-100" />
                    </td>
                    <td className="py-4">
                      <div className="h-4 w-40 rounded bg-slate-100" />
                    </td>
                    <td className="py-4">
                      <div className="h-4 w-16 rounded bg-slate-100" />
                    </td>
                    <td className="py-4">
                      <div className="h-4 w-16 rounded bg-slate-100" />
                    </td>
                    <td className="py-4">
                      <div className="h-4 w-20 rounded bg-slate-100" />
                    </td>
                    <td className="py-4">
                      <div className="h-4 w-24 rounded bg-slate-100" />
                    </td>
                    <td className="py-4 text-right">
                      <div className="ml-auto h-8 w-16 rounded bg-slate-100" />
                    </td>
                  </tr>
                ))
                : filteredProducts.map(product => {
                  const key = product._id || product.id
                  return (
                    <tr
                      key={key}
                      className="cursor-pointer text-slate-700 transition hover:bg-slate-50/60"
                      onClick={() => openProductModal(product)}
                    >
                      <td className="py-4">
                        <div className="h-14 w-14 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-semibold text-slate-900">{product.name}</p>
                          <p className="text-xs uppercase tracking-wide text-slate-400">{product.sku || key}</p>
                        </div>
                      </td>
                      <td className="py-4">{product.old_price ? currency.format(product.old_price) : '—'}</td>
                      <td className="py-4 font-semibold text-slate-900">
                        {product.new_price ? currency.format(product.new_price) : '—'}
                      </td>
                      <td className="py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {product.category || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.available
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                            }`}
                        >
                          {product.available ? 'Live' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          type="button"
                          onClick={event => {
                            event.stopPropagation()
                            deleteProduct(product.id || product._id)
                          }}
                          className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-rose-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        {!loading && filteredProducts.length === 0 && (
          <p className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No products match your filters.
          </p>
        )}
      </div>
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6"
          onClick={closeProductModal}
        >
          <div
            className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl"
            onClick={event => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Product detail</p>
                <h2 className="text-2xl font-semibold text-slate-900">{selectedProduct.name}</h2>
                <p className="text-sm text-slate-500">SKU {selectedProduct.sku || selectedProduct._id || selectedProduct.id}</p>
              </div>
              <button
                type="button"
                onClick={closeProductModal}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <div className="grid gap-6 px-6 py-6 md:grid-cols-[240px,1fr]">
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
                  {selectedProduct.image ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
                  )}
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Availability:{' '}
                  <span className={`font-semibold ${selectedProduct.available ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {selectedProduct.available ? 'Live on storefront' : 'Hidden from storefront'}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Category</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedProduct.category || 'N/A'}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">New price</p>
                    <p className="text-xl font-bold text-slate-900">
                      {selectedProduct.new_price ? currency.format(selectedProduct.new_price) : '—'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Old price</p>
                    <p className="text-xl font-semibold text-slate-600">
                      {selectedProduct.old_price ? currency.format(selectedProduct.old_price) : '—'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Description</p>
                  <p className="text-sm text-slate-600">
                    {selectedProduct.description || 'This product does not have a description yet.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleEditNavigation(selectedProduct)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700"
                  >
                    Edit product
                  </button>
                  <button
                    type="button"
                    onClick={closeProductModal}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductList