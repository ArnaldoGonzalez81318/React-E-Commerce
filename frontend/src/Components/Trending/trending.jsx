import React, { useState, useEffect } from 'react'
import Item from '../Item/item'

import './trending.css'

const initialState = {
  products: [],
  loading: true,
  error: '',
}

const Trending = () => {
  const [{ products, loading, error }, setState] = useState(initialState)

  useEffect(() => {
    const controller = new AbortController()

    const fetchTrending = async () => {
      try {
        const response = await fetch('http://localhost:4000/trending-women', { signal: controller.signal })
        if (!response.ok) {
          throw new Error('Unable to load trending collection')
        }
        const data = await response.json()
        const parsed = Array.from(data?.trendingWomen || []).map(product => ({
          ...product,
          productId: product?._id ?? product?.id,
          badge: 'Trending',
        }))
        setState({ products: parsed, loading: false, error: '' })
      } catch (err) {
        if (err.name === 'AbortError') return
        setState({ products: [], loading: false, error: 'We hit a snag loading the trending looks. Please try again shortly.' })
      }
    }

    fetchTrending()
    return () => controller.abort()
  }, [])

  const skeletons = Array.from({ length: 4 })

  return (
    <section className="trending section-shell" aria-labelledby="trending-heading">
      <div className="section-heading">
        <p className="pill">Editor&apos;s pick</p>
        <h2 id="trending-heading">Trending Women&apos;s Collection</h2>
        <p>Layered neutrals, textured knits, and statement sneakers curated weekly by our stylists.</p>
        <hr />
      </div>

      {error && (
        <div role="alert" className="trending-error">
          {error}
        </div>
      )}

      <div className="trending-grid" aria-live="polite">
        {loading
          ? skeletons.map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-line" style={{ height: '180px' }} />
              <div className="skeleton-line" />
              <div className="skeleton-line" style={{ width: '70%' }} />
            </div>
          ))
          : products.map(product => (
            <Item
              key={product.productId ?? product.id}
              {...product}
              badge={product.badge}
            />
          ))}
      </div>

      {!loading && !error && products.length === 0 && (
        <p className="trending-empty">Check back soon for fresh drops.</p>
      )}
    </section>
  )
}

export default Trending