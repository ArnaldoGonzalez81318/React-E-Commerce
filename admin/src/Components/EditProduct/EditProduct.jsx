import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import uploadArea from '../../assets/upload_area.svg'

const parseJsonResponse = async response => {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch (error) {
      console.error('Failed to parse JSON response', error)
      return { success: 0, message: 'Unable to parse server response' }
    }
  }
  const fallbackText = (await response.text())?.trim()
  return { success: 0, message: fallbackText || 'Unexpected response format from server' }
}

const emptyProduct = {
  name: '',
  image: '',
  category: '',
  old_price: '',
  new_price: '',
  description: '',
  available: true,
}

const categoryOptions = [
  { label: 'Select category', value: '' },
  { label: 'Women', value: 'women' },
  { label: 'Men', value: 'men' },
  { label: 'Kids', value: 'kids' },
]

const EditProduct = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [image, setImage] = useState(null)
  const [productDetails, setProductDetails] = useState(emptyProduct)
  const [originalProduct, setOriginalProduct] = useState(emptyProduct)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image)
      setPreviewUrl(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
    setPreviewUrl(productDetails.image || '')
    return undefined
  }, [image, productDetails.image])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) {
          throw new Error('Missing product identifier in route')
        }

        setIsLoading(true)
        const response = await fetch(`http://localhost:4000/products/${productId}`)
        const data = await parseJsonResponse(response)
        if (!response.ok || !data?.success) {
          const message = data?.message || (response.status === 404
            ? 'Product not found. It may have been removed.'
            : `Unable to load product (HTTP ${response.status})`)
          throw new Error(message)
        }
        setProductDetails({ ...emptyProduct, ...data.product })
        setOriginalProduct({ ...emptyProduct, ...data.product })
        setStatus({ type: 'idle', message: '' })
      } catch (error) {
        console.error('Fetch product error', error)
        setStatus({ type: 'error', message: error.message || 'Unexpected error while loading product' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const imageHandler = event => {
    const file = event.target.files?.[0]
    if (!file) return
    setImage(file)
  }

  const changeHandler = event => {
    const { name, value, type, checked } = event.target
    setProductDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const resetForm = () => {
    setProductDetails(originalProduct)
    setImage(null)
    setStatus({ type: 'idle', message: '' })
  }

  const validateForm = () => {
    const issues = []
    if (!productDetails.name.trim()) issues.push('product name')
    if (!productDetails.category) issues.push('category')
    if (!productDetails.old_price) issues.push('price')
    if (!productDetails.new_price) issues.push('offer price')
    if (!productDetails.description.trim()) issues.push('description')
    if (!productDetails.image && !image) issues.push('hero image')
    return issues
  }

  const uploadImageIfNeeded = async () => {
    if (!image) {
      return productDetails.image
    }

    setStatus({ type: 'info', message: 'Uploading image...' })

    const formData = new FormData()
    formData.append('productImage', image)

    const uploadResponse = await fetch('http://localhost:4000/upload', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    })

    const uploadData = await uploadResponse.json()
    if (!uploadResponse.ok || !uploadData?.success) {
      throw new Error(uploadData?.message || 'Image upload failed')
    }

    return uploadData.profile_url
  }

  const updateProductHandler = async event => {
    event.preventDefault()
    const issues = validateForm()
    if (issues.length) {
      setStatus({ type: 'error', message: `Please provide: ${issues.join(', ')}` })
      return
    }

    setIsSubmitting(true)

    try {
      const imageUrl = await uploadImageIfNeeded()
      const payload = {
        name: productDetails.name,
        category: productDetails.category,
        old_price: productDetails.old_price,
        new_price: productDetails.new_price,
        description: productDetails.description,
        available: productDetails.available,
        image: imageUrl,
      }

      setStatus({ type: 'info', message: 'Saving changes...' })

      const response = await fetch(`http://localhost:4000/products/${productId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await parseJsonResponse(response)

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || `Unable to update product (HTTP ${response.status})`)
      }

      setStatus({ type: 'success', message: 'Product updated successfully' })
      setOriginalProduct({ ...productDetails, image: imageUrl })
      setProductDetails(prev => ({ ...prev, image: imageUrl }))
      setImage(null)
    } catch (error) {
      console.error('Update product error', error)
      setStatus({ type: 'error', message: error.message || 'Unexpected error while saving' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-100 bg-white/70 p-6 text-center text-sm text-slate-500">
        Loading product details...
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Products</p>
          <h1 className="text-2xl font-semibold text-slate-900">Edit product</h1>
          <p className="text-sm text-slate-500">Update listing information and publish changes to the storefront.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Reset changes
          </button>
        </div>
      </div>

      {status.type !== 'idle' && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${status.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
            : status.type === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-900'
              : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={updateProductHandler} className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700" htmlFor="name">
              Product name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="E.g. Cotton Crewneck Tee"
              value={productDetails.name}
              onChange={changeHandler}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="price">
                Price
              </label>
              <input
                id="price"
                name="old_price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={productDetails.old_price}
                onChange={changeHandler}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="newPrice">
                Offer price
              </label>
              <input
                id="newPrice"
                name="new_price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={productDetails.new_price}
                onChange={changeHandler}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={productDetails.category}
                onChange={changeHandler}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="available">
                Availability
              </label>
              <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner">
                <span className="text-slate-600">Show in storefront</span>
                <input
                  id="available"
                  name="available"
                  type="checkbox"
                  checked={productDetails.available}
                  onChange={changeHandler}
                  className="h-5 w-5 accent-brand-500"
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              placeholder="Highlight the fabric, fit, and care details..."
              value={productDetails.description}
              onChange={changeHandler}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Hero image</p>
            <label
              htmlFor="image"
              className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 text-center text-slate-500 transition hover:border-brand-300 hover:bg-brand-50/50"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Selected product" className="h-full w-full rounded-xl object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <img src={uploadArea} className="h-16 w-16" alt="Upload" />
                  <div>
                    <p className="font-semibold text-slate-900">Drop an image or click to browse</p>
                    <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              )}
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={imageHandler}
                className="sr-only"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving changes...' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Revert to saved
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white/70 p-4 shadow-inner">
          <p className="text-sm font-semibold text-slate-700">Live preview</p>
          <div className="mt-4 flex flex-col gap-4">
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">Image preview</div>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{productDetails.category || 'Category'}</p>
              <p className="text-lg font-semibold text-slate-900">
                {productDetails.name || 'Product name'}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-brand-600">
                  {productDetails.new_price ? `$${Number(productDetails.new_price).toFixed(2)}` : '$0.00'}
                </p>
                <p className="text-sm text-slate-400 line-through">
                  {productDetails.old_price ? `$${Number(productDetails.old_price).toFixed(2)}` : ''}
                </p>
              </div>
              <p className="text-sm text-slate-500">
                {productDetails.description || 'Product description preview will appear here.'}
              </p>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${productDetails.available
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-500'
                  }`}
              >
                {productDetails.available ? 'Visible in store' : 'Hidden'}
              </span>
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}

export default EditProduct
