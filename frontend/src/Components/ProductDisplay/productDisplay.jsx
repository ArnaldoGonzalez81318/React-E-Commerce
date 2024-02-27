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
        <p className='product-display-price-old'>
          <span className='product-display-price-old-label'>Was: </span>
          <span className='product-display-price-old-value'>${product.old_price}</span>
        </p>
        <p className='product-display-price-new'>
          <span className='product-display-price-new-label'>Now: </span>
          <span className='product-display-price-new-value'>${product.new_price}</span>
        </p>
        <p className='product-display-description'>{product.description}</p>
        <div className='product-display-variations'>
          <div className='product-display-colors'>
            <h3>Color</h3>
            <div className='product-display-colors-list'>
              <div className='product-display-color'>
                <div className='product-display-color-dot' style={{ backgroundColor: 'red' }}></div>
              </div>
              <div className='product-display-color'>
                <div className='product-display-color-dot' style={{ backgroundColor: 'blue' }}></div>
              </div>
              <div className='product-display-color'>
                <div className='product-display-color-dot' style={{ backgroundColor: 'green' }}></div>
              </div>
              <div className='product-display-color'>
                <div className='product-display-color-dot' style={{ backgroundColor: 'yellow' }}></div>
              </div>
              <div className='product-display-color'>
                <div className='product-display-color-dot' style={{ backgroundColor: 'black' }}></div>
              </div>
            </div>
          </div>

          <div className='product-display-sizes'>
            <h3>Size</h3>
            <div className='product-display-sizes-list'>
              <div className='product-display-size'>XS</div>
              <div className='product-display-size'>S</div>
              <div className='product-display-size'>M</div>
              <div className='product-display-size'>L</div>
              <div className='product-display-size'>XL</div>
              <div className='product-display-size'>2XL</div>
              <div className='product-display-size'>3XL</div>
            </div>
          </div>
        </div>
        <div className='product-display-quantity'>
          <h3>Quantity</h3>
          <div className='product-display-quantity-selector'>
            <button>-</button>
            <input type='text' value='1' />
            <button>+</button>
          </div>
        </div>
        <button className='product-display-add-to-cart-btn'>Add to Cart</button>
        <button className='product-display-buy-now-btn'>Buy Now</button>
      </div>
    </div>
  )
}

export default ProductDisplay