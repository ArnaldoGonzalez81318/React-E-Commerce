import React from 'react'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'

import './productDisplay.css'

const ProductDisplay = (props) => {
  const { product } = props

  return (
    <div className='product-display'>
      <div className='product-display-container'>
        <div className='product-display-images-list'>
          <img src={product.image} alt={product.name} />
          <img src={product.image} alt={product.name} />
          <img src={product.image} alt={product.name} />
          <img src={product.image} alt={product.name} />
        </div>
        <div className='product-display-image'>
          <img className='product-display-image-main' src={product.image} alt={product.title} />
        </div>
      </div>
      <div className='product-display-info'>
        <h2 className='product-display-title'>{product.name}</h2>
        <div className='product-display-review'>
          <div className='product-display-rating'>
            <img src={star_icon} alt='star' />
            <img src={star_icon} alt='star' />
            <img src={star_icon} alt='star' />
            <img src={star_icon} alt='star' />
            <img src={star_dull_icon} alt='star' />
          </div>
          <p className='product-display-review-count'>(1,245) reviews</p>
        </div>
        <p className='product-display-price-old'>${product.old_price}</p>
        <p className='product-display-price-new'>${product.new_price}</p>
        <p className='product-display-description'>{product.description}</p>
        <div className='product-display-variations'>
          <h3>Select Size</h3>
          <div className='product-display-size'>
            <p>S</p>
            <p>M</p>
            <p>L</p>
            <p>XL</p>
            <p>XXL</p>
          </div>
        </div>
        <div className='product-display-quantity'>
          <h3>Quantity</h3>
          <div className='product-display-quantity-selector'>
            <button>-</button>
            <p>1</p>
            <button>+</button>
          </div>
        </div>
        <button className='product-display-addToCart'>Add to Cart</button>
      </div>
    </div>
  )
}

export default ProductDisplay