import { useEffect, useMemo, useState } from 'react'
import uploadArea from '../../assets/upload_area.svg'

const variationConfigs = {
  apparel: {
    label: 'Apparel (tees, coats, etc.)',
    sizeType: 'alpha',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: ['#0f172a', '#1f2937', '#475569', '#f97316', '#6366f1', '#0ea5e9'],
  },
  footwear: {
    label: 'Footwear (sneakers, boots, slides)',
    sizeType: 'numeric',
    sizes: Array.from({ length: 30 }, (_, index) => {
      const value = 3.5 + index * 0.5
      return Number.isInteger(value) ? value.toFixed(0) : value.toString()
    }),
    colors: ['#0f172a', '#1e293b', '#dc2626', '#f59e0b', '#10b981'],
  },
  accessory: {
    label: 'Accessory (bags, jewelry, etc.)',
    sizeType: 'none',
    sizes: [],
    colors: ['#0f172a', '#6366f1'],
  },
  other: {
    label: 'Other',
    sizeType: 'none',
    sizes: [],
    colors: [],
  },
}

const getDefaultVariants = (type = 'apparel') => {
  const config = variationConfigs[type] || variationConfigs.other
  return {
    sizes: [...config.sizes],
    colors: [...config.colors],
  }
}

const buildEmptyProduct = () => {
  const defaults = getDefaultVariants('apparel')
  return {
    name: '',
    image: '',
    category: '',
    productType: 'apparel',
    old_price: '',
    new_price: '',
    description: '',
    available: true,
    variantSizes: defaults.sizes,
    variantColors: defaults.colors,
  }
}

const categoryOptions = [
  { label: 'Select category', value: '' },
  { label: 'Women', value: 'women' },
  { label: 'Men', value: 'men' },
  { label: 'Kids', value: 'kids' },
]

const AddProduct = () => {
  const [image, setImage] = useState(null)
  const [productDetails, setProductDetails] = useState(() => buildEmptyProduct())
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customSize, setCustomSize] = useState('')
  const [customColor, setCustomColor] = useState('')

  const previewUrl = useMemo(() => (image ? URL.createObjectURL(image) : null), [image])
  const variationConfig = variationConfigs[productDetails.productType] || variationConfigs.other

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const imageHandler = event => {
    const file = event.target.files?.[0]
    if (!file) return
    setImage(file)
  }

  const changeHandler = event => {
    const { name, value, type, checked } = event.target

    if (name === 'productType') {
      const defaults = getDefaultVariants(value)
      setProductDetails(prev => ({
        ...prev,
        productType: value,
        variantSizes: defaults.sizes,
        variantColors: defaults.colors,
      }))
      return
    }

    setProductDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const resetForm = () => {
    setProductDetails(buildEmptyProduct())
    setImage(null)
    setStatus({ type: 'idle', message: '' })
    setCustomSize('')
    setCustomColor('')
  }

  const validateForm = () => {
    const issues = []
    if (!productDetails.name.trim()) issues.push('product name')
    if (!productDetails.category) issues.push('category')
    if (!productDetails.old_price) issues.push('price')
    if (!productDetails.new_price) issues.push('offer price')
    if (!productDetails.description.trim()) issues.push('description')
    if (!image) issues.push('hero image')

    const requiresSizes = ['apparel', 'footwear'].includes(productDetails.productType)
    const requiresColors = ['apparel', 'footwear'].includes(productDetails.productType)

    if (requiresSizes && productDetails.variantSizes.length === 0) issues.push('at least one size')
    if (requiresColors && productDetails.variantColors.length === 0) issues.push('at least one color')
    return issues
  }

  const addProductHandler = async event => {
    event.preventDefault()
    const issues = validateForm()
    if (issues.length) {
      setStatus({ type: 'error', message: `Please provide: ${issues.join(', ')}` })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: 'info', message: 'Uploading image...' })

    try {
      const formData = new FormData()
      formData.append('productImage', image)

      const uploadResponse = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      })

      const uploadData = await uploadResponse.json()

      if (!uploadData?.success) {
        throw new Error(uploadData?.message || 'Image upload failed')
      }

      const { variantSizes, variantColors, ...productPayload } = productDetails

      const payload = {
        ...productPayload,
        image: uploadData.profile_url,
        variants: {
          sizeType: variationConfig.sizeType,
          sizes: variantSizes,
          colors: variantColors,
        },
      }

      setStatus({ type: 'info', message: 'Saving product...' })

      const productResponse = await fetch('http://localhost:4000/add-product', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const productData = await productResponse.json()

      if (!productData?.success) {
        throw new Error(productData?.message || 'Unable to save product')
      }

      setStatus({ type: 'success', message: 'Product added successfully' })
      resetForm()
    } catch (error) {
      console.error('Add product error', error)
      setStatus({ type: 'error', message: error.message || 'Unexpected error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Products</p>
          <h1 className="text-2xl font-semibold text-slate-900">Add a new product</h1>
          <p className="text-sm text-slate-500">Complete the form below to publish a new listing to the storefront.</p>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Reset form
        </button>
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

      <form onSubmit={addProductHandler} className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="productType">
                Product type
              </label>
              <select
                id="productType"
                name="productType"
                value={productDetails.productType}
                onChange={changeHandler}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                {Object.entries(variationConfigs).map(([value, option]) => (
                  <option key={value} value={value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-slate-700">Variation preset</p>
              <p className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-500">
                {variationConfig.sizeType === 'alpha'
                  ? 'Use apparel sizes (XS-2XL) plus curated colors.'
                  : variationConfig.sizeType === 'numeric'
                    ? 'Use half-size footwear range plus color palette.'
                    : 'Optional variations for accessories.'}
              </p>
            </div>
          </div>

          {variationConfig.sizeType !== 'none' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Sizes</p>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Select all that apply</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(variationConfig.sizes.length
                  ? Array.from(new Set([...variationConfig.sizes, ...productDetails.variantSizes]))
                  : productDetails.variantSizes
                ).map(size => {
                  const isActive = productDetails.variantSizes.includes(size)
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setProductDetails(prev => ({
                          ...prev,
                          variantSizes: isActive
                            ? prev.variantSizes.filter(item => item !== size)
                            : [...prev.variantSizes, size],
                        }))
                      }}
                      className={`rounded-full border px-3 py-1 text-sm font-medium transition ${isActive
                        ? 'border-brand-200 bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={customSize}
                  onChange={event => setCustomSize(event.target.value)}
                  placeholder="Add custom size"
                  className="w-40 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    const value = customSize.trim()
                    if (!value) return
                    setProductDetails(prev => ({
                      ...prev,
                      variantSizes: prev.variantSizes.includes(value)
                        ? prev.variantSizes
                        : [...prev.variantSizes, value],
                    }))
                    setCustomSize('')
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Add size
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Colors</p>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Select swatches</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {(variationConfig.colors.length
                ? Array.from(new Set([...variationConfig.colors, ...productDetails.variantColors]))
                : productDetails.variantColors
              ).map(color => {
                const isActive = productDetails.variantColors.includes(color)
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setProductDetails(prev => ({
                        ...prev,
                        variantColors: isActive
                          ? prev.variantColors.filter(item => item !== color)
                          : [...prev.variantColors, color],
                      }))
                    }}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${isActive
                      ? 'border-brand-500'
                      : 'border-transparent'}`}
                    style={{ backgroundColor: color, color: '#fff' }}
                    aria-label={`Toggle color ${color}`}
                  >
                    {isActive ? '✓' : ''}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={customColor}
                onChange={event => setCustomColor(event.target.value)}
                placeholder="Add hex or color name"
                className="w-56 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
              <button
                type="button"
                onClick={() => {
                  const value = customColor.trim()
                  if (!value) return
                  setProductDetails(prev => ({
                    ...prev,
                    variantColors: prev.variantColors.includes(value)
                      ? prev.variantColors
                      : [...prev.variantColors, value],
                  }))
                  setCustomColor('')
                }}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Add color
              </button>
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
              {isSubmitting ? 'Saving product...' : 'Add product'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Clear draft
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

export default AddProduct