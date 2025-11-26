import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2'
import { ShopContext } from '../../Context/shopContext'

import './item.css'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const Item = ({ id, _id, productId, image, name, old_price, new_price, badge }) => {
  const resolvedId = _id ?? productId ?? id
  const href = resolvedId ? `/product/${resolvedId}` : undefined
  const { isProductWishlisted, toggleWishlist } = useContext(ShopContext)

  const wishlistActive = resolvedId ? isProductWishlisted(resolvedId) : false

  const handleWishlistToggle = event => {
    event.preventDefault()
    event.stopPropagation()
    if (!resolvedId) return
    toggleWishlist(resolvedId)
  }

  const priceOld = typeof old_price === 'number' ? priceFormatter.format(old_price) : old_price
  const priceNew = typeof new_price === 'number' ? priceFormatter.format(new_price) : new_price

  const imageElement = (
    <div className="item-media" aria-hidden={!href}>
      <img src={image} alt={name} loading="lazy" />
      {badge && <span className="item-badge">{badge}</span>}
      <button
        type="button"
        className={`item-wishlist ${wishlistActive ? 'is-active' : ''}`}
        onClick={handleWishlistToggle}
        aria-pressed={wishlistActive}
        aria-label={wishlistActive ? 'Remove from wishlist' : 'Save to wishlist'}
      >
        {wishlistActive ? (
          <HiHeart aria-hidden="true" />
        ) : (
          <HiOutlineHeart aria-hidden="true" />
        )}
      </button>
    </div>
  )

  const title = (
    <h3 className="item-title" title={name}>
      {name}
    </h3>
  )

  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <article className="item card" aria-label={name}>
      {href ? (
        <Link to={href} onClick={handleScrollTop} className="item-link">
          {imageElement}
        </Link>
      ) : (
        imageElement
      )}

      <div className="item-content">
        {href ? (
          <Link to={href} onClick={handleScrollTop} className="item-link">
            {title}
          </Link>
        ) : (
          title
        )}

        <p className="item-subtitle">Limited release · Ships in 48h</p>

        <div className="item-price">
          {priceOld && <span className="price-old">{priceOld}</span>}
          {priceNew && <span className="price-new">{priceNew}</span>}
        </div>
      </div>

      <div className="item-actions">
        {href ? (
          <Link to={href} onClick={handleScrollTop} className="btn-secondary item-cta">
            View product
          </Link>
        ) : (
          <button type="button" className="btn-secondary item-cta" disabled>
            Coming soon
          </button>
        )}
      </div>
    </article>
  )
}

export default Item