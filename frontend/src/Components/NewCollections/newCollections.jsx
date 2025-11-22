import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Item from '../Item/item'

import './newCollections.css'

const initialState = {
  products: [],
  loading: true,
  error: '',
}

const NewCollections = () => {
  const [{ products, loading, error }, setState] = useState(initialState)

  useEffect(() => {
    const controller = new AbortController()

    const fetchNewCollections = async () => {
      try {
        const response = await fetch('http://localhost:4000/new-collections', { signal: controller.signal })
        if (!response.ok) {
          throw new Error('Unable to fetch new collections')
        }
        const data = await response.json()
        const parsed = Array.from(data?.newCollections || []).map(product => ({
          ...product,
          productId: product?._id ?? product?.id,
          badge: 'New',
        }))
        setState({ products: parsed, loading: false, error: '' })
      } catch (err) {
        if (err.name === 'AbortError') return
        setState({ products: [], loading: false, error: 'Our latest capsules are loading slowly. Please refresh.' })
      }
    }

    fetchNewCollections()
    return () => controller.abort()
  }, [])

  const skeletons = Array.from({ length: 8 })

  return (
    <section className="newCollections section-shell" aria-labelledby="collections-heading">
      <div className="section-heading">
        <p className="pill">Fresh drop</p>
        <h2 id="collections-heading">New Collections</h2>
        <p>From monochrome palettes to bold collabs, explore what just landed in the studio.</p>
        <hr />
      </div>

      {error && (
        <div role="alert" className="collections-error">
          {error}
        </div>
      )}

      <div className="collections" aria-live="polite">
        {loading
          ? skeletons.map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-line" style={{ height: '220px' }} />
              <div className="skeleton-line" />
              <div className="skeleton-line" style={{ width: '60%' }} />
            </div>
          ))
          : products.map(product => (
            <Item
              key={product.productId ?? product.id}
              {...product}
            />
          ))}
      </div>

      <div className="collections-footer">
        <Link to="/" className="btn-primary">
          View full collection
        </Link>
      </div>
    </section>
  )
}

export default NewCollections