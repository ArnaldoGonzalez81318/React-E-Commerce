import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../Context/shopContext'
import Item from '../Components/Item/item'
import './CSS/wishlist.css'

const Wishlist = () => {
  const {
    wishlist,
    allProducts,
    clearWishlist,
    shouldPromptWishlistSync,
    isAuthenticated,
  } = useContext(ShopContext)

  const wishlistItems = useMemo(() => {
    if (!wishlist.length) return []
    const unique = new Set()
    const items = []
    wishlist.forEach(id => {
      const product = allProducts.find(product => String(product.id) === id || product._id === id)
      if (!product) return
      const productKey = product._id ?? String(product.id)
      if (unique.has(productKey)) return
      unique.add(productKey)
      items.push(product)
    })
    return items
  }, [wishlist, allProducts])

  const isLoadingProducts = wishlist.length > 0 && wishlistItems.length === 0 && allProducts.length === 0

  const renderEmptyState = () => (
    <div className="wishlist-empty">
      <p className="wishlist-eyebrow">Your wishlist is waiting</p>
      <h1>Save the looks you love</h1>
      <p>Tap the heart on any product to keep track of drops, compare fits, or share with friends.</p>
      <div className="wishlist-empty-actions">
        <Link to="/" className="btn-primary">Start shopping</Link>
        <Link to="/login" className="btn-secondary">Sign in</Link>
      </div>
    </div>
  )

  return (
    <section className="wishlist section-shell">
      <header className="wishlist-header">
        <div>
          <p className="wishlist-eyebrow">Wishlist</p>
          <h1>Keep your shortlist handy</h1>
          <p>Save favorites without logging in, then sign in anytime to sync across devices.</p>
        </div>
        {wishlist.length > 0 && (
          <div className="wishlist-header-actions">
            <span>{wishlist.length} item{wishlist.length === 1 ? '' : 's'}</span>
            <button type="button" onClick={clearWishlist} className="btn-tertiary">
              Clear wishlist
            </button>
          </div>
        )}
      </header>

      {shouldPromptWishlistSync && !isAuthenticated && wishlist.length > 0 && (
        <div className="wishlist-sync-card">
          <div>
            <p className="wishlist-sync-title">Make it permanent</p>
            <p className="wishlist-sync-copy">Create an account to access your wishlist from any device, get price drop alerts, and share collections.</p>
          </div>
          <Link to="/login" className="btn-primary">
            Sign in
          </Link>
        </div>
      )}

      {wishlist.length === 0 && !isLoadingProducts && renderEmptyState()}

      {isLoadingProducts && (
        <div className="wishlist-grid" aria-live="polite">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="wishlist-skeleton">
              <div className="skeleton media" />
              <div className="skeleton line" />
              <div className="skeleton line short" />
            </div>
          ))}
        </div>
      )}

      {wishlistItems.length > 0 && (
        <div className="wishlist-grid" aria-live="polite">
          {wishlistItems.map(product => (
            <Item key={product._id ?? product.id} {...product} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Wishlist
